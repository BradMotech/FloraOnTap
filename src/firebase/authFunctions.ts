import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

// Sign in function
export const signIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Sign up function
export const signUp = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Sign out function
export const logOut = () => {
  return auth.signOut();
};
