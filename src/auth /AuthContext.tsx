import React, { createContext, useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase'; // Firebase setup
import { fetchHairstylistsFromFirestore, fetchUserFromFirestore } from '../firebase/dbFunctions';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';

// Define the shape of the context value
interface AuthContextProps {
  user: any;
  userData:any,
  hairstylistsData:any,
  setHairstylistsData:any,
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
}

// Initialize the context with default values
export const AuthContext = createContext<AuthContextProps>({
  user: null,
  userData:null,
  hairstylistsData:null,
  hairstylesData:null,
  setHairstylesData:null,
  setHairstylistsData:null,
  signIn: async () => {},
  logOut: async () => {},
  userType: null,
  setUserType: null,
  isAuthenticated: false,
  loading: true,
  setErrorMessage:null,
  errorMessage:null,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [hairstylistsData, setHairstylistsData] = useState<any>(null);
  const [hairstylesData, setHairstylesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<any>(null);

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
      let fetchedHairstylists = null;
      if(fetchedUserType === "Provider"){
       fetchedHairstylists = await fetchHairstylistsFromFirestore(user.uid);
      }else if(fetchedUserType === "Customer"){
        fetchedHairstylists = await fetchHairstylistsFromFirestore();
      }
      setUserType(fetchedUserType);
      setUser(user);
      setUserData(fetchedUserdata)
      setHairstylistsData(fetchedHairstylists)
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
        } catch (error) {
          console.error('Error fetching user type: ', error);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setUserType(null);
        setLoading(false);
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
    <AuthContext.Provider value={{ user,userData,hairstylistsData,hairstylesData,setHairstylesData,setHairstylistsData, signIn, logOut, userType, setUserType, isAuthenticated, loading,setErrorMessage,errorMessage }}>
      {children}
    </AuthContext.Provider>
  );
};
