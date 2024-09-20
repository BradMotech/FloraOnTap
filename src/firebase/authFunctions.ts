import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
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

// Reset password
export const resetPasswordAsync = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent successfully.');
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};
