import React, { createContext, useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase'; // Firebase setup
import { fetchAppointmentsPending, fetchFloraProvidersFromFirestore, fetchUserFromFirestore } from '../firebase/dbFunctions';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';

// Define the shape of the context value
interface AuthContextProps {
  user: any;
  userData:any,
  flowerProvidersData:any,
  setFloraProvidersData:any,
  hairstylesData:any,
  setHairstylesData:any,
  signIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  userType: string | null;
  isAuthenticated: boolean;
  setUserType: (type: string | null) => void,
  loading: boolean;
  setErrorMessage: any;
  errorMessage: any;
  setAppointments:any,
  appointments: any; // Add appointments to context
  fetchUserAppointments: (uid: string) => Promise<void>; // Function to fetch user appointments
}

// Initialize the context with default values
export const AuthContext = createContext<AuthContextProps>({
  user: null,
  userData:null,
  flowerProvidersData:null,
  hairstylesData:null,
  setHairstylesData:null,
  setFloraProvidersData:null,
  signIn: async () => {},
  logOut: async () => {},
  userType: null,
  setUserType: null,
  isAuthenticated: false,
  loading: true,
  setErrorMessage:null,
  errorMessage:null,
  setAppointments:null,
  appointments: null, // Default value for appointments
  fetchUserAppointments: async () => {}, // Default function for fetching appointments
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [flowerProvidersData, setFloraProvidersData] = useState<any>(null);
  const [hairstylesData, setHairstylesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const [appointments, setAppointments] = useState<any>(null); 

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User credential:", userCredential);
      const fetchedUserType = await fetchUserTypeFromDatabase(user.uid);
      console.log("🚀 ~ signIn ~ fetchedUserType:", fetchedUserType)
      const fetchedUserdata = await fetchUserFromFirestore(user.uid);
      let fetchedFloraProviders = null;
      if(fetchedUserType === "Provider"){
       fetchedFloraProviders = await fetchFloraProvidersFromFirestore(user.uid);
      }else if(fetchedUserType === "Customer"){
        fetchedFloraProviders = await fetchFloraProvidersFromFirestore();
      }
      setUserType(fetchedUserType);
      setUser(user);
      setUserData(fetchedUserdata)
      setFloraProvidersData(fetchedFloraProviders)
    } catch (error) {
      console.error('Error signing in:', error);
      setErrorMessage(error)
      // Alert.alert("Error signing in", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserType(null);
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

    // Function to fetch user appointments
    const fetchUserAppointments = async (uid: string) => {
      const fetchedUserType = await fetchUserTypeFromDatabase(user.uid);
      const userType = fetchedUserType === "Provider" ? 'provider':'customer';
      if (!uid) return; // Return if no user ID
      setLoading(true);
      try {
        const fetchedAppointments = await fetchAppointmentsPending(uid, userType); 
        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error); 
        setErrorMessage(error);
      } finally {
        setLoading(false);
      }
    };

  // Listen for auth state changes
  useEffect(() => {
    console.log("Setting up onAuthStateChanged listener"); // Log when listener is set up
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("onAuthStateChanged triggered with user:", user); // Log each time the listener is triggered
      
      if (user) {
        try {
          setLoading(true);
          const fetchedUserType = await fetchUserTypeFromDatabase(user.uid);
          setUserType(fetchedUserType);
          setUser(user);
          await fetchUserAppointments(user.uid); // Fetch appointments when user state changes
        } catch (error) {
          console.error('Error fetching user type: ', error);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setUserType(null);
        setLoading(false);
        setAppointments(null); // Reset appointments when user is logged out
      }
    });
  
    return () => {
      console.log("Unsubscribing from onAuthStateChanged listener"); // Log when listener is removed
      unsubscribe();
    };
  }, []);
  

  // Function to fetch user type from the database
  const fetchUserTypeFromDatabase = async (uid: string): Promise<string> => {
    try {
      const userDoc = await fetchUserFromFirestore(uid);
      return userDoc?.selectedRoleValue ?? 'Customer'; // Default to 'Customer' if no type is found
    } catch (error) {
      console.error('Error fetching user type from database:', error);
      return 'Customer'; // Default to 'Customer' on error
    } 
  };

  // Determine if the user is authenticated
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user,userData,flowerProvidersData,hairstylesData,setHairstylesData,setFloraProvidersData, signIn, logOut, userType, setUserType, isAuthenticated, loading,setErrorMessage,errorMessage,appointments, // Include appointments in the context
      fetchUserAppointments,setAppointments // Include fetch function in the context
       }}>
      {children}
    </AuthContext.Provider>
  );
};
