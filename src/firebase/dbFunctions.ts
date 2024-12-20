import { doc, getDoc, setDoc, collection, query, where, getDocs, addDoc, deleteDoc, updateDoc, arrayUnion, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid"; // To generate a unique ID for the image
import { storage } from "./firebase"; // Make sure your firebaseConfig is correctly imported
import { getAuth } from 'firebase/auth';
import dayjs from 'dayjs'; // Library for working with dates

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
// Add or update user data in Firestore
export const setHairstylistInFirestore = async (uid: string, userData: any) => {
  const docRef = doc(db, 'flowerProviders', uid);
  await setDoc(docRef, userData, { merge: true });
};

// Fetch appointments from Firestore (for providers or customers)
export const fetchAppointments = async (uid: string, selectedRoleValue: 'provider' | 'customer') => {
  const appointmentsRef = collection(db, 'appointments');
  const q = query(appointmentsRef, where(selectedRoleValue === 'provider' ? 'providerId' : 'customerId', '==', uid));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => doc.data());
};

// Fetch appointments from Firestore for providers or customers with status "ORDER PLACED"
export const fetchAppointmentsPending = async (uid: string, selectedRoleValue: 'provider' | 'customer') => {
  const appointmentsRef = collection(db, 'appointments');

  // Create the query with two conditions: matching user ID and status
  const q = query(
    appointmentsRef,
    where(selectedRoleValue === 'provider' ? 'providerId' : 'customerId', '==', uid),
    where('appointmentStatus', '==', 'ORDER PLACED') // Filtering by appointment status
  );

  const querySnapshot = await getDocs(q);
  // Map through the documents and return the data
  return querySnapshot.docs.map((doc) => ({
    id: doc.id, // Optionally include the document ID
    ...doc.data()
  }));
};

// Fetch flowerProviders from Firestore
export const fetchFloraProvidersFromFirestore = async (uid?: string) => {
  try {
    // Define the collection reference
    const usersRef = collection(db, 'flowerProviders');

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

// Fetch Flora from Firestore based on floristId
export const fetchHairstylesFromFirestore = async (uid: string) => {
  try {
    // Define the collection reference
    const hairstylesRef = collection(db, 'Flora');

    // Create a query to filter documents by 'floristId'
    const q = query(hairstylesRef, where('floristId', '==', uid));

    // Get the documents matching the query
    const querySnapshot = await getDocs(q);

    // Map and return the data of all documents
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map(doc => doc.data());
    } else {
      console.log('No Flora found for the given floristId');
      return [];
    }
  } catch (error) {
    console.error('Error fetching Flora:', error);
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
export const fetchAppointmentsByCustomerId = (customerId: string, callback: (appointments: any[]) => void) => {
  try {
    // Define the collection reference
    const appointmentsRef = collection(db, 'appointments');

    // Create a query to filter documents by 'customerId'
    const q = query(appointmentsRef, where('customerId', '==', customerId));

    // Set up a real-time listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const appointments = [];

      // Map and return the data of all documents
      querySnapshot.forEach((doc) => {
        appointments.push(doc.data());
      });

      // Call the provided callback with the fetched appointments
      callback(appointments);
    });

    // Return the unsubscribe function for cleanup
    return unsubscribe;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return () => {}; // Return a no-op function
  }
};

// Fetch appointments from Firestore based on floristId within the selectedHairstyle field
export const fetchAppointmentsByHairstylistId = (floristId: string, onUpdate: (appointments: any[]) => void) => {
  try {
    // Define the collection reference
    const appointmentsRef = collection(db, 'appointments');

    // Create a query to filter documents where 'selectedHairstyle.floristId' matches the given floristId
    const q = query(appointmentsRef, where('selectedHairstyle.floristId', '==', floristId));

    // Set up a real-time listener using onSnapshot
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const appointments = querySnapshot.docs.map(doc => doc.data());
        // Invoke the callback with the updated data
        onUpdate(appointments);
      } else {
        console.log('No appointments found for the given floristId');
        onUpdate([]);
      }
    }, (error) => {
      console.error('Error fetching real-time appointments:', error);
      onUpdate([]); // Pass an empty array on error
    });

    // Return the unsubscribe function so it can be called to stop listening
    return unsubscribe;

  } catch (error) {
    console.error('Error setting up real-time appointments listener:', error);
    onUpdate([]);
  }
};

const generateReceipt = (bookingId, selectedHairstyle, appointmentDate, customerInfo, notes) => {
  // Create a receipt object
  const receipt = {
    bookingId,
    hairstyle: selectedHairstyle.name, // Assuming the hairstyle has a name property
    stylist: selectedHairstyle.hairstylistName, // Assuming the hairstylist has a name property
    appointmentDate,
    customerName: `${customerInfo.firstName} ${customerInfo.lastName}`, // Assuming customerInfo has these fields
    notes: notes || 'No additional notes provided',
    createdAt: new Date().toLocaleString(), // Format date as needed
  };

  // Return the formatted receipt
  return receipt;
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
      providerId: selectedHairstyle.floristId,
      appointmentStatus: 'ORDER PLACED', // Set initial status to pending
      events: events, // Events if any
      comments: notes || '', // Optional additional notes
      createdAt: new Date().toISOString(),
    });

    // Update the newly created document with its ID
    const bookingDocRef = doc(db, 'appointments', newBooking.id);
    await updateDoc(bookingDocRef, {
      id: newBooking.id, // Add document ID as 'id' field
    });

    // Generate a receipt
    const receipt = generateReceipt(
      newBooking.id,
      selectedHairstyle,
      appointmentDate,
      userCustomerInfo[0], // Assuming the first element has the customer info
      notes
    );

    console.log('Receipt generated:', receipt);

    console.log('Booking created successfully with ID:', newBooking.id);
    return { success: true, bookingId: newBooking.id,receipt };
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
// export const acceptBooking = async (bookingId: string) => {
//   try {
//     // Define the document reference to the booking
//     const bookingRef = doc(db, 'appointments', bookingId);

//     // Update the booking status to accepted
//     await updateDoc(bookingRef, {
//       appointmentStatus: 'ACCEPTED',
//     });

//     console.log('Booking accepted successfully');
//     return { success: true };
//   } catch (error) {
//     console.error('Error accepting booking:', error);
//     return { success: false, message: error.message };
//   }
// };

export const acceptBooking = async (bookingId: string) => {
  try {
    // Define the document reference to the booking
    const bookingRef = doc(db, 'appointments', bookingId);

    // Get the booking data
    const bookingSnap = await getDoc(bookingRef);
    
    if (bookingSnap.exists()) {
      const bookingData = bookingSnap.data();

      // Update the booking status to accepted
      await updateDoc(bookingRef, {
        appointmentStatus: 'OUT FOR DELIVERY',
      });
      // Extract the date and price from the booking data
      const appointmentDate = dayjs(bookingData.appointmentDate);
      const price = bookingData.selectedHairstyle.price || 0;  // Default to 0 if price is missing
      // Determine the day of the week (e.g., Mon, Tue) and the month (e.g., Jan, Feb)
      const dayOfWeek = appointmentDate.format('ddd');  // e.g., "Mon", "Tue"
      const month = appointmentDate.format('MMM');      // e.g., "Jan", "Feb"

      // Log weekly data
      const weeklyMetrics = {
        label: dayOfWeek,   // e.g., 'Mon', 'Tue', etc.
        value: price,       // Price of the appointment
        appointmentDate: bookingData.appointmentDate,
        bookingData: bookingData,
        providerId: bookingData.providerId,
      };

      // Log monthly data
      const monthlyMetrics = {
        label: month,       // e.g., 'Jan', 'Feb', etc.
        value: price,       // Price of the appointment
        appointmentDate: bookingData.appointmentDate,
        bookingData: bookingData,
        providerId: bookingData.providerId,
      };
      // Save the weekly metrics to Firestore (e.g., 'weeklyMetrics')
      await addDoc(collection(db, 'weeklyMetrics'), weeklyMetrics);
      
      // Save the monthly metrics to Firestore (e.g., 'monthlyMetrics')
      await addDoc(collection(db, 'monthlyMetrics'), monthlyMetrics);

      console.log('Booking accepted and metrics logged successfully');
      return { success: true };
    } else {
      console.error('No such booking found');
      return { success: false, message: 'No such booking found' };
    }

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

    // Get the booking data
    const bookingSnap = await getDoc(bookingRef);
    
    if (bookingSnap.exists()) {
      const bookingData = bookingSnap.data();

      // Update the booking status to declined
      await updateDoc(bookingRef, {
        appointmentStatus: 'DECLINED',
      });

      const appointmentDate = dayjs(bookingData.appointmentDate);
      const price = bookingData.selectedHairstyle.price || 0;  // Default to 0 if price is missing
      // Determine the day of the week (e.g., Mon, Tue) and the month (e.g., Jan, Feb)
      const dayOfWeek = appointmentDate.format('ddd');  // e.g., "Mon", "Tue"
      const month = appointmentDate.format('MMM');      // e.g., "Jan", "Feb"

      // Log weekly data
      const weeklyMetrics = {
        label: dayOfWeek,   // e.g., 'Mon', 'Tue', etc.
        value:  Number(price),       // Price of the appointment
        appointmentDate: bookingData.appointmentDate,
        bookingData: bookingData,
        providerId: bookingData.providerId,
      };

      // Log monthly data
      const monthlyMetrics = {
        label: month,       // e.g., 'Jan', 'Feb', etc.
        value:  Number(price),       // Price of the appointment
        appointmentDate: bookingData.appointmentDate,
        bookingData: bookingData,
        providerId: bookingData.providerId,
      };

      // Save the weekly metrics to Firestore (e.g., 'weeklyMetrics')
      await addDoc(collection(db, 'weeklyMetrics'), weeklyMetrics);

      // Save the monthly metrics to Firestore (e.g., 'monthlyMetrics')
      await addDoc(collection(db, 'monthlyMetrics'), monthlyMetrics);

      console.log('Booking declined and metrics logged successfully');
      return { success: true };
    } else {
      console.error('No such booking found');
      return { success: false, message: 'No such booking found' };
    }

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

// Function to fetch reviews by floristId
export const fetchReviews = (floristId: string, callback: (reviews: any[]) => void) => {
  const reviewsRef = collection(db, 'reviews');
  const reviewsQuery = query(reviewsRef, where('floristId', '==', floristId));

  // Real-time listener
  return onSnapshot(reviewsQuery, (snapshot) => {
    const reviews = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(reviews);
  });
};

// Function to add a review
export const addReview = async (review: {
  customerId: string,
  customerName: string,
  customerEmail: string,
  customerImage: string,
  customerPhone: string,
  rating: number,
  description: string,
  floristId: string,
}) => {
  try {
    const reviewsRef = collection(db, 'reviews');
    await addDoc(reviewsRef, {
      ...review,
      createdAt: serverTimestamp() // Use server timestamp for the createdAt field
    });
  } catch (error) {
    console.error("Error adding review: ", error);
  }
};

// Function to update the subscription totalCredits for the user
export const updateUserSubscriptionCredits = async (uid: string, valueToSubtract: number) => {
  try {
    // Create a query to find the user where the 'id' field matches the uid
    const usersRef = collection(db, 'Users');
    const q = query(usersRef, where('id', '==', uid));

    // Get the documents that match the query
    const querySnapshot = await getDocs(q);

    // If a matching user is found, update their subscription.totalCredits
    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (userDoc) => {
        const userData = userDoc.data();

        // Extract the current totalCredits from subscription
        const currentCredits = userData?.subscription?.totalCredits ?? 0;
        const currentCreditsUsed = userData?.subscription?.totalCreditsUsed ?? 0;
        console.warn("current credits as recieved : "+ currentCredits)

        // Calculate the new totalCredits by subtracting the value
        const newTotalCredits = currentCredits - valueToSubtract;
        const newTotalCreditsUsed = currentCreditsUsed + valueToSubtract;
        console.warn("new total credits : " + newTotalCredits, valueToSubtract)
        // Ensure the totalCredits doesn't go below zero
        const updatedTotalCredits = newTotalCredits >= 0 ? newTotalCredits : 0;

        // Update the subscription.totalCredits in Firestore for the found user
        await setDoc(
          userDoc.ref,
          { subscription: { totalCredits: updatedTotalCredits, totalCreditsUsed: newTotalCreditsUsed } },
          { merge: true }
        );

        console.log(`Updated totalCredits for ${uid} to: ${updatedTotalCredits}`);
      });
    } else {
      console.log('No user found with the given UID.');
    }
  } catch (error) {
    console.error('Error updating user subscription credits:', error);
  }
};
// Function to update the subscription totalCredits for the hairstylist
export const updateHairStylistSubscriptionCredits = async (uid: string, valueToSubtract: number) => {
  try {
    // Create a query to find the user where the 'id' field matches the uid
    const usersRef = collection(db, 'flowerProviders');
    const q = query(usersRef, where('id', '==', uid));

    // Get the documents that match the query
    const querySnapshot = await getDocs(q);

    // If a matching user is found, update their subscription.totalCredits
    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (userDoc) => {
        const userData = userDoc.data();

        // Extract the current totalCredits from subscription
        const currentCredits = userData?.subscription?.totalCredits ?? 0;
        const currentCreditsUsed = userData?.subscription?.totalCreditsUsed ?? 0;
        // Calculate the new totalCredits by subtracting the value
        const newTotalCredits = currentCredits - valueToSubtract;
        const newTotalCreditsUsed = currentCreditsUsed + valueToSubtract;
        console.warn("🚀 ~ querySnapshot.forEach ~ newTotalCredits:", newTotalCredits)

        // Ensure the totalCredits doesn't go below zero
        const updatedTotalCredits = newTotalCredits >= 0 ? newTotalCredits : 0;
        console.warn("🚀 ~ querySnapshot.forEach ~ updatedTotalCredits:", updatedTotalCredits)

        // Update the subscription.totalCredits in Firestore for the found user
        await setDoc(
          userDoc.ref,
          { subscription: { totalCredits: updatedTotalCredits, totalCreditsUsed: newTotalCreditsUsed } },
          { merge: true }
        );

        console.log(`Updated totalCredits for ${uid} to: ${updatedTotalCredits}`);
      });
    } else {
      console.log('No user found with the given UID.');
    }
  } catch (error) {
    console.error('Error updating user subscription credits:', error);
  }
};

// Function to update user details in the Users collection
export const updateUserProfileDetails = async (uid: string, updatedData: object) => {
  try {
    // Create a query to find the user where the 'id' field matches the uid
    const usersRef = collection(db, 'Users');
    const q = query(usersRef, where('id', '==', uid));

    // Get the documents that match the query
    const querySnapshot = await getDocs(q);

    // If a matching user is found, update their details
    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (userDoc) => {
        // Update the user details in Firestore for the found user
        await setDoc(
          userDoc.ref,
          updatedData,
          { merge: true }
        );

        console.log(`Updated user details for ${uid}`);
      });
    } else {
      console.log('No user found with the given UID.');
    }
  } catch (error) {
    console.error('Error updating user profile details:', error);
  }
};

// Function to update hairstylist details in the FloraProviders collection
export const updateHairStylistProfileDetails = async (uid: string, updatedData: object) => {
  try {
    // Create a query to find the hairstylist where the 'id' field matches the uid
    const usersRef = collection(db, 'flowerProviders');
    const q = query(usersRef, where('id', '==', uid));

    // Get the documents that match the query
    const querySnapshot = await getDocs(q);

    // If a matching hairstylist is found, update their details
    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (userDoc) => {
        // Update the hairstylist details in Firestore for the found user
        await setDoc(
          userDoc.ref,
          updatedData,
          { merge: true }
        );

        console.log(`Updated hairstylist details for ${uid}`);
      });
    } else {
      console.log('No hairstylist found with the given UID.');
    }
  } catch (error) {
    console.error('Error updating hairstylist profile details:', error);
  }
};

// Function to upload image to Firebase Storage and get the URL
export const uploadImageToStorage = async (imageUri, uid) => {
  if (!imageUri) return '';

  try {
    // Convert image to a Blob for Firebase Storage
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const storageRef = ref(storage, `flowerProviders/${uid}.jpg`);
    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);

    return url;
  } catch (error) {
    console.error('Error uploading image to Firebase:', error);
    throw new Error('Image upload failed');
  }
};

// Function to update Patrons array in the Users collection
export const updateUserPatrons = async (uid: string, patronData: object) => {
  try {
    const usersRef = collection(db, 'Users');
    const q = query(usersRef, where('id', '==', uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (userDoc) => {
        await setDoc(
          userDoc.ref,
          {
            patrons: arrayUnion(patronData) // Adds patron to the patrons array
          },
          { merge: true }
        );
        console.log(`Added patron to user ${uid}`);
      });
    } else {
      console.log('No user found with the given UID.');
    }
  } catch (error) {
    console.error('Error updating user patrons:', error);
  }
};

// Function to update Patrons array in the FloraProviders collection
export const updateHairStylistPatrons = async (uid: string, patronData: object) => {
  try {
    const stylistsRef = collection(db, 'flowerProviders');
    const q = query(stylistsRef, where('id', '==', uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (stylistDoc) => {
        await setDoc(
          stylistDoc.ref,
          {
            patrons: arrayUnion(patronData) // Adds patron to the patrons array
          },
          { merge: true }
        );
        console.log(`Added patron to hairstylist ${uid}`);
      });
    } else {
      console.log('No hairstylist found with the given UID.');
    }
  } catch (error) {
    console.error('Error updating hairstylist patrons:', error);
  }
};

// Function to retrieve Patrons from the Users collection
export const getUserPatrons = async (uid: string) => {
  try {
    const usersRef = collection(db, 'Users');
    const q = query(usersRef, where('id', '==', uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      return userData.patrons || [];
    } else {
      console.log('No user found with the given UID.');
      return [];
    }
  } catch (error) {
    console.error('Error retrieving user patrons:', error);
    return [];
  }
};

// Function to retrieve Patrons from the FloraProviders collection
export const getHairStylistPatrons = async (uid: string) => {
  try {
    const stylistsRef = collection(db, 'flowerProviders');
    const q = query(stylistsRef, where('id', '==', uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const stylistDoc = querySnapshot.docs[0];
      const stylistData = stylistDoc.data();
      return stylistData.patrons || [];
    } else {
      console.log('No hairstylist found with the given UID.');
      return [];
    }
  } catch (error) {
    console.error('Error retrieving hairstylist patrons:', error);
    return [];
  }
};

export const subscribeToFloraProviders = (uid, callback) => {
  try {
    const usersRef = collection(db, 'Users');
    let q;

    // Create a query based on whether uid is provided or not
    if (uid) {
      q = query(usersRef, where('id', '==', uid));
    } else {
      q = query(usersRef);
    }

    // Subscribe to Firestore changes using onSnapshot
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const flowerProvidersData = querySnapshot.docs.map(doc => doc.data());
      
      // Call the callback function with the new data
      callback(flowerProvidersData);
    }, (error) => {
      console.error('Error subscribing to flowerProviders:', error);
    });

    // Return the unsubscribe function to clean up the listener when no longer needed
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up Firestore listener:', error);
    return null;
  }
};

// Function to update the availability for the user
export const updateUserAvailability = async (uid: string, newAvailability: any) => {
  try {
    // Create a query to find the user where the 'id' field matches the uid
    const usersRef = collection(db, 'Users');
    const q = query(usersRef, where('id', '==', uid));

    // Get the documents that match the query
    const querySnapshot = await getDocs(q);

    // If a matching user is found
    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (userDoc) => {
        const userData = userDoc.data();
        const currentAvailability = userData?.availability ?? [];

        // Update or add the new availability
        const updatedAvailability = updateAvailabilityArray(currentAvailability, newAvailability);

        // Save the updated availability array to Firestore
        await setDoc(
          userDoc.ref,
          { availability: updatedAvailability },
          { merge: true } // Merge to ensure other fields remain intact
        );

        console.log(`Updated availability for User ${uid} to:`, updatedAvailability);
      });
    } else {
      console.log('No user found with the given UID.');
    }
  } catch (error) {
    console.error('Error updating user availability:', error);
  }
};

// Function to update the availability for the hairstylist
export const updateHairStylistAvailability = async (uid: string, newAvailability: any) => {
  try {
    // Create a query to find the hairstylist where the 'id' field matches the uid
    const hairstylistsRef = collection(db, 'flowerProviders');
    const q = query(hairstylistsRef, where('id', '==', uid));

    // Get the documents that match the query
    const querySnapshot = await getDocs(q);

    // If a matching hairstylist is found
    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (stylistDoc) => {
        const stylistData = stylistDoc.data();
        const currentAvailability = stylistData?.availability ?? [];

        // Update or add the new availability
        const updatedAvailability = updateAvailabilityArray(currentAvailability, newAvailability);

        // Save the updated availability array to Firestore
        await setDoc(
          stylistDoc.ref,
          { availability: updatedAvailability },
          { merge: true } // Merge to ensure other fields remain intact
        );

        console.log(`Updated availability for Hairstylist ${uid} to:`, updatedAvailability);
      });
    } else {
      console.log('No hairstylist found with the given UID.');
    }
  } catch (error) {
    console.error('Error updating hairstylist availability:', error);
  }
};

// Helper function to update or add availability without duplicating days
const updateAvailabilityArray = (currentAvailability: any[], newAvailability: any[]) => {
  const updatedAvailability = [...currentAvailability];

  newAvailability.forEach((newDay) => {
    const index = updatedAvailability.findIndex((day) => day.day === newDay.day);

    if (index !== -1) {
      // If the day exists, update its startTime and endTime
      updatedAvailability[index] = { ...updatedAvailability[index], ...newDay };
    } else {
      // If the day doesn't exist, add the new day to the array
      updatedAvailability.push(newDay);
    }
  });

  return updatedAvailability;
};
// Function to update the subscription totalCredits and plan for the user and hairstylist
export const SubscribeToPlanForUserAndHairstylist = async (
  uid: string, 
  valueToAdd: number, 
  newPlan: string
) => {
  try {
    // Create references for both the 'Users' and 'flowerProviders' collections
    const usersRef = collection(db, 'Users');
    const hairstylistsRef = collection(db, 'flowerProviders');

    // Create a query to find the user in both collections where the 'id' field matches the uid
    const userQuery = query(usersRef, where('id', '==', uid));
    const hairstylistQuery = query(hairstylistsRef, where('id', '==', uid));

    // Get the documents that match the query in both collections
    const userSnapshot = await getDocs(userQuery);
    const hairstylistSnapshot = await getDocs(hairstylistQuery);

    // Helper function to update documents
    const updateCreditsAndPlan = async (doc: any, collectionName: string) => {
      const data = doc.data();

      // Extract the current totalCredits from subscription
      const currentCredits = data?.subscription?.totalCredits ?? 0;

      // Calculate the new totalCredits by adding the value
      const newTotalCredits = currentCredits + valueToAdd;

      // Update the subscription details in Firestore for the found document
      await setDoc(
        doc.ref,
        { 
          subscription: { 
            totalCredits: newTotalCredits, 
            plan: newPlan 
          } 
        },
        { merge: true }
      );

      console.log(`Updated totalCredits for ${collectionName} with UID ${uid} to: ${newTotalCredits}, Plan set to: ${newPlan}`);
    };

    // If a matching user is found in 'Users', update their subscription.totalCredits and plan
    if (!userSnapshot.empty) {
      userSnapshot.forEach((doc) => updateCreditsAndPlan(doc, 'Users'));
    } else {
      console.log('No user found with the given UID in Users collection.');
    }

    // If a matching hairstylist is found in 'flowerProviders', update their subscription.totalCredits and plan
    if (!hairstylistSnapshot.empty) {
      hairstylistSnapshot.forEach((doc) => updateCreditsAndPlan(doc, 'flowerProviders'));
    } else {
      console.log('No hairstylist found with the given UID in flowerProviders collection.');
    }
  } catch (error) {
    console.error('Error updating subscription credits and plan in Users and flowerProviders:', error);
  }
};

// Update merchant details
// Function to update the merchant details for the hairstylist
export const updateFloristMerchantDetails = async (
  uid: string,
  merchant: { merchantId: string; merchantKey: string; paymentType: string }
) => {
  try {
    // Create a query to find the user where the 'id' field matches the uid
    const usersRef = collection(db, 'flowerProviders');
    const q = query(usersRef, where('id', '==', uid));

    // Get the documents that match the query
    const querySnapshot = await getDocs(q);

    // If a matching user is found, update their merchant details
    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (userDoc) => {
        // Update merchant details in Firestore for the found user
        await setDoc(
          userDoc.ref,
          { merchant }, // Use the entire merchant object to update
          { merge: true }
        );

        console.log(`Updated merchant details for ${uid}`);
      });
    } else {
      console.log('No user found with the given UID.');
    }
  } catch (error) {
    console.error('Error updating merchant details:', error);
  }
};

// Function to update merchant details in the Users collection
export const updateUserMerchantDetails = async (
  uid: string,
  merchant: { merchantId: string; merchantKey: string; paymentType: string }
) => {
  try {
    // Create a query to find the user where the 'id' field matches the uid
    const usersRef = collection(db, 'Users');
    const q = query(usersRef, where('id', '==', uid));

    // Get the documents that match the query
    const querySnapshot = await getDocs(q);

    // If a matching user is found, update their merchant details
    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (userDoc) => {
        // Update the merchant details in Firestore for the found user
        await setDoc(
          userDoc.ref,
          { merchant }, // Use the entire merchant object to update
          { merge: true }
        );

        console.log(`Updated merchant details for ${uid}`);
      });
    } else {
      console.log('No user found with the given UID.');
    }
  } catch (error) {
    console.error('Error updating merchant details:', error);
  }
};

// Fetch notifications for a specific user in real-time
export const fetchNotificationsRealtime = (currentUserId, onNotificationUpdate) => {
  try {
    const q = query(collection(db, 'notifications'), where('userId', '==', currentUserId));

    // Use onSnapshot to listen for real-time updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notifications = [];
      querySnapshot.forEach((doc) => {
        notifications.push({ id: doc.id, ...doc.data() });
      });

      // Pass the notifications data to the callback
      onNotificationUpdate(notifications);
    });

    // Return the unsubscribe function to stop listening when necessary
    return unsubscribe;
  } catch (error) {
    console.error('Error fetching notifications in real-time:', error);
  }
};

// Update notification read status for a specific user
// Update or add a notification for a specific user
export const updateNotificationReadStatus = async (id, readStatus, currentUserId,title,details,senderId) => {
  try {
    if (!id) {
      // If id is null or undefined, add a new notification with an auto-generated ID
      const newNotification = {
        userId: currentUserId,
        senderId: senderId,
        read: readStatus,
        details: details,
        timestamp: new Date(),
        title: title, // Customize the message as needed
      };
      
      await addDoc(collection(db, 'notifications'), newNotification);
      console.log('New notification added with auto-generated ID');
    } else {
      // If id is provided, attempt to update the existing notification
      const notificationRef = doc(db, 'notifications', id);
      const notificationSnap = await getDoc(notificationRef);

      // Check if the notification exists and belongs to the current user
      if (notificationSnap.exists()) {
        const notificationData = notificationSnap.data();

        if (notificationData.userId === currentUserId) {
          // Update the notification read status
          await updateDoc(notificationRef, { read: readStatus });
          console.log('Notification read status updated');
        } else {
          console.warn('Notification does not belong to the current user');
        }
      } else {
        // If the notification does not exist, add it as a new one
        const newNotification = {
          userId: currentUserId,
          senderId: senderId,
          read: readStatus,
          details: details,
          timestamp: new Date(),
          title: title, // Customize the message as needed
        };
        await setDoc(notificationRef, newNotification);
        console.log('New notification added');
      }
    }
  } catch (error) {
    console.error('Error updating or adding notification:', error);
  }
};

// update only status
export const updateNotificationReadStatusOnly = async (id, readStatus, currentUserId,senderId) => {
  try {
    if (!id) {
      // If id is null or undefined, add a new notification with auto-generated ID
      const newNotification = {
        userId: currentUserId,
        senderId: senderId,
        read: readStatus,
        timestamp: new Date(),
      };
      
      await addDoc(collection(db, 'notifications'), newNotification);
      console.log('New notification added with auto-generated ID');
    } else {
      // If id is provided, attempt to update the existing notification
      const notificationRef = doc(db, 'notifications', id);
      const notificationSnap = await getDoc(notificationRef);

      // Check if the notification exists and belongs to the current user
      if (notificationSnap.exists()) {
        const notificationData = notificationSnap.data();

        if (notificationData.userId === currentUserId) {
          // Update the notification read status
          await updateDoc(notificationRef, { read: readStatus });
          console.log('Notification read status updated');
        } else {
          console.warn('Notification does not belong to the current user');
        }
      } else {
        // If the notification does not exist, add it as a new one
        const newNotification = {
          userId: currentUserId,
          senderId: senderId,
          read: readStatus,
          timestamp: new Date(),
        };
        await setDoc(notificationRef, newNotification);
        console.log('New notification added');
      }
    }
  } catch (error) {
    console.error('Error updating or adding notification:', error);
  }
};


// Delete notification for a specific user
export const deleteNotification = async (id, currentUserId) => {
  try {
    const notificationRef = doc(db, 'notifications', id);
    const notificationSnap = await getDoc(notificationRef);

    if (notificationSnap.exists() && notificationSnap.data().userId === currentUserId) {
      await deleteDoc(notificationRef);
    } else {
      console.warn('Notification does not belong to the current user');
    }
  } catch (error) {
    console.error('Error deleting notification:', error);
  }
};

export const fetchAllCustomerImages = async () => {
  try {
    // Get reference to the "CustomerImages" collection
    const querySnapshot = await getDocs(collection(db, "CustomerImages"));
    
    // Map through the querySnapshot to get all documents
    const customerImages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return customerImages;
  } catch (error) {
    console.error("Error fetching all customer images: ", error);
    throw error;
  }
};

export const fetchCustomerImagesByFloristId = async (floristId) => {
  try {
    // Get reference to the "CustomerImages" collection and apply the filter by floristId
    const customerImagesQuery = query(
      collection(db, "CustomerImages"), 
      where("floristId", "==", floristId)
    );
    
    // Execute the query
    const querySnapshot = await getDocs(customerImagesQuery);
    
    // Map through the querySnapshot to get all documents matching the floristId
    const customerImages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return customerImages;
  } catch (error) {
    console.error("Error fetching customer images by floristId: ", error);
    throw error;
  }
};
