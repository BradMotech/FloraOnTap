import { doc, getDoc, setDoc, collection, query, where, getDocs, addDoc, deleteDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid"; // To generate a unique ID for the image
import { storage } from "./firebase"; // Make sure your firebaseConfig is correctly imported
import { getAuth } from 'firebase/auth';

// Fetch user type (provider or customer) from Firestore
export const fetchUserFromFirestore = async (uid: string) => {

  try {
    // Define the collection reference
    const usersRef = collection(db, 'Users');

    // Create a query to search for the document where the 'uid' field matches the provided uid
    const q = query(usersRef, where('id', '==', uid));

    // Get the documents matching the query
    const querySnapshot = await getDocs(q);

    // Check if the query returned any documents
    if (!querySnapshot.empty) {
      // Return the first matching document's data (assuming only one user has this UID)
      return querySnapshot.docs[0].data();
    } else {
      console.log('No user found with this UID');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

// Add or update user data in Firestore
export const setUserInFirestore = async (uid: string, userData: any) => {
  const docRef = doc(db, 'Users', uid);
  await setDoc(docRef, userData, { merge: true });
};

// Fetch appointments from Firestore (for providers or customers)
export const fetchAppointments = async (uid: string, selectedRoleValue: 'provider' | 'customer') => {
  const appointmentsRef = collection(db, 'appointments');
  const q = query(appointmentsRef, where(selectedRoleValue === 'provider' ? 'providerId' : 'customerId', '==', uid));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => doc.data());
};

// Fetch hairstylists from Firestore
export const fetchHairstylistsFromFirestore = async (uid?: string) => {
  try {
    // Define the collection reference
    const usersRef = collection(db, 'hairstylists');

    // Create a query based on whether uid is provided or not
    let q;

    if (uid) {
      // Create a query to search for the document where the 'id' field matches the provided uid
      q = query(usersRef, where('id', '==', uid));
    } else {
      // Create a query to fetch all documents
      q = query(usersRef);
    }

    // Get the documents matching the query
    const querySnapshot = await getDocs(q);

    // Check if the query returned any documents
    if (!querySnapshot.empty) {
      // Return the data of all documents if fetching all, or the first document if filtering by uid
      return querySnapshot.docs.map(doc => doc.data());
    } else {
      console.log('No users found');
      return [];
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Fetch hairstyles from Firestore based on hairstylistId
export const fetchHairstylesFromFirestore = async (uid: string) => {
  try {
    // Define the collection reference
    const hairstylesRef = collection(db, 'hairstyles');

    // Create a query to filter documents by 'hairstylistId'
    const q = query(hairstylesRef, where('hairstylistId', '==', uid));

    // Get the documents matching the query
    const querySnapshot = await getDocs(q);

    // Map and return the data of all documents
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map(doc => doc.data());
    } else {
      console.log('No hairstyles found for the given hairstylistId');
      return [];
    }
  } catch (error) {
    console.error('Error fetching hairstyles:', error);
    return [];
  }
};

/**
 * Uploads an image to Firebase Storage and returns the download URL.
 * 
 * @param imageUri - The URI of the image to upload.
 * @returns {Promise<string>} - The download URL of the uploaded image.
 */
export const uploadImageToFirebase = async (imageUri: string): Promise<string> => {
  try {
    const uniqueImageId = uuidv4(); // Generate a unique ID for the image

    // Fetch the image as a blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Create a reference to Firebase Storage
    const storageRef = ref(storage, `profileImages/${uniqueImageId}`);

    // Upload the image blob to Firebase Storage
    await uploadBytes(storageRef, blob);

    // Get the download URL from Firebase Storage
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL; // Return the download URL
  } catch (error) {
    console.error("Error uploading image: ", error);
    throw new Error("Image upload failed");
  }
};

// Fetch appointments from Firestore based on customerId
export const fetchAppointmentsByCustomerId = async (customerId: string) => {
  try {
    // Define the collection reference
    const appointmentsRef = collection(db, 'appointments');

    // Create a query to filter documents by 'customerId'
    const q = query(appointmentsRef, where('customerId', '==', customerId));

    // Get the documents matching the query
    const querySnapshot = await getDocs(q);

    // Map and return the data of all documents
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map(doc => doc.data());
    } else {
      console.log('No appointments found for the given customerId');
      return [];
    }
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
};

// Fetch appointments from Firestore based on hairstylistId within the selectedHairstyle field
export const fetchAppointmentsByHairstylistId = async (hairstylistId: string) => {
  try {
    // Define the collection reference
    const appointmentsRef = collection(db, 'appointments');

    // Create a query to filter documents where 'selectedHairstyle.hairstylistId' matches the given hairstylistId
    const q = query(appointmentsRef, where('selectedHairstyle.hairstylistId', '==', hairstylistId));

    // Get the documents matching the query
    const querySnapshot = await getDocs(q);

    // Map and return the data of all documents
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map(doc => doc.data());
    } else {
      console.log('No appointments found for the given hairstylistId');
      return [];
    }
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
};

// Create a new booking
export const makeBooking = async (
  customerId: string,
  selectedHairstyle: any,
  appointmentDate: string,
  notes?: string,
  events?: any[],
  userCustomerInfo?: any[]
) => {
  try {
    // Define the collection reference
    const appointmentsRef = collection(db, 'appointments');

    // Add a new document with booking details
    const newBooking = await addDoc(appointmentsRef, {
      customerId,
      selectedHairstyle, // Object with hairstylist details and selected style
      appointmentDate,
      userCustomerInfo: userCustomerInfo,
      providerId: selectedHairstyle.hairstylistId,
      appointmentStatus: 'PENDING', // Set initial status to pending
      events: events, // Events if any
      comments: notes || '', // Optional additional notes
      createdAt: new Date().toISOString(),
    });

    // Update the newly created document with its ID
    const bookingDocRef = doc(db, 'appointments', newBooking.id);
    await updateDoc(bookingDocRef, {
      id: newBooking.id, // Add document ID as 'id' field
    });

    console.log('Booking created successfully with ID:', newBooking.id);
    return { success: true, bookingId: newBooking.id };
  } catch (error) {
    console.error('Error creating booking:', error);
    return { success: false, message: error.message };
  }
};

// Cancel a booking
export const cancelBooking = async (bookingId: string) => {
  console.log("here is the appointment id: " + bookingId)
  try {
    // Define the document reference to the booking
    const bookingRef = doc(db, 'appointments', bookingId);

    // Delete the booking
    await deleteDoc(bookingRef);

    console.log('Booking canceled successfully');
    return { success: true };
  } catch (error) {
    console.error('Error canceling booking:', error);
    return { success: false, message: error.message };
  }
};

// Accept a booking
export const acceptBooking = async (bookingId: string) => {
  try {
    // Define the document reference to the booking
    const bookingRef = doc(db, 'appointments', bookingId);

    // Update the booking status to accepted
    await updateDoc(bookingRef, {
      appointmentStatus: 'ACCEPTED',
    });

    console.log('Booking accepted successfully');
    return { success: true };
  } catch (error) {
    console.error('Error accepting booking:', error);
    return { success: false, message: error.message };
  }
};

// Decline a booking
export const declineBooking = async (bookingId: string) => {
  try {
    // Define the document reference to the booking
    const bookingRef = doc(db, 'appointments', bookingId);

    // Update the booking status to declined
    await updateDoc(bookingRef, {
      appointmentStatus: 'DECLINED',
    });

    console.log('Booking declined successfully');
    return { success: true };
  } catch (error) {
    console.error('Error declining booking:', error);
    return { success: false, message: error.message };
  }
};

export async function updateUserFriends(data: { id: string }) {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    console.warn('No authenticated user found');
    return;
  }

  try {
    // Query the Users collection to check if the current user exists
    const currentUserQuery = query(collection(db, 'Users'), where('id', '==', currentUser.uid));
    const currentUserSnapshot = await getDocs(currentUserQuery);

    if (!currentUserSnapshot.empty) {
      // Update current user's friends list
      currentUserSnapshot.forEach(async (docSnapshot) => {
        const userData = docSnapshot.data();
        const currentFriends = userData?.friends || [];
        
        if (!currentFriends.includes(data.id)) {
          await updateDoc(docSnapshot.ref, {
            friends: arrayUnion(data.id), // arrayUnion prevents duplicates
          });
          console.log(`Friend ${data.id} added to current user's friends list.`);
        } else {
          console.warn(`Friend ${data.id} is already in the current user's friends list.`);
        }
      });
    } else {
      console.warn('No matching user found in Users collection.');
    }

    // Query the Users collection to check if the other user exists
    const otherUserQuery = query(collection(db, 'Users'), where('id', '==', data.id));
    const otherUserSnapshot = await getDocs(otherUserQuery);

    if (!otherUserSnapshot.empty) {
      // Update other user's friends list
      otherUserSnapshot.forEach(async (docSnapshot) => {
        const userData = docSnapshot.data();
        const otherUserFriends = userData?.friends || [];
        
        if (!otherUserFriends.includes(currentUser.uid)) {
          await updateDoc(docSnapshot.ref, {
            friends: arrayUnion(currentUser.uid), // arrayUnion prevents duplicates
          });
          console.log(`Current user's ID added to friend ${data.id}'s friends list.`);
        } else {
          console.warn(`Current user's ID is already in friend ${data.id}'s friends list.`);
        }
      });
    } else {
      console.warn('No matching user found in Users collection for the friend.');
    }

  } catch (error) {
    console.error('Error updating user friends:', error);
  }
}

interface Friend {
  id: string;
  name: string;
  image: string;
}

export const fetchUserFriendsData = async (): Promise<Friend[]> => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    console.warn('No authenticated user found');
    return [];
  }

  try {
    // Fetch the current user data
    const q = query(collection(db, 'Users'), where('id', '==', currentUser.uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const friendsList: Friend[] = [];
      for (const docSnapshot of querySnapshot.docs) {
        const userData = docSnapshot.data();
        const friendIds: string[] = userData?.friends || [];

        // Fetch full friend data for each friendId
        for (const friendId of friendIds) {
          const friendQuery = query(collection(db, 'Users'), where('id', '==', friendId));
          const friendSnapshot = await getDocs(friendQuery);

          friendSnapshot.forEach((friendDoc) => {
            const friendData = friendDoc.data();
            // Assuming friendData contains 'name' field
            friendsList.push({
              id: friendData.id,
              name: friendData.name,
              image:friendData.image
            });
          });
        }
      }
      return friendsList;
    } else {
      console.warn('No matching user found in Users collection.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching user friends:', error);
    return [];
  }
};