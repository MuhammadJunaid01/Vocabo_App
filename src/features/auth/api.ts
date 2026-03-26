import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { User } from '../../core/types';

const mapFirebaseUser = (user: any): User => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
});

// Email/Password Login
export const loginWithEmail = async (email: string, password: string): Promise<User> => {
  const { user } = await auth().signInWithEmailAndPassword(email, password);
  return mapFirebaseUser(user);
};

// Email/Password Register
export const registerWithEmail = async (email: string, password: string): Promise<User> => {
  const { user } = await auth().createUserWithEmailAndPassword(email, password);
  return mapFirebaseUser(user);
};

// Google Sign-In
export const loginWithGoogle = async (): Promise<User> => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const { idToken }: any = await GoogleSignin.signIn();
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  const { user } = await auth().signInWithCredential(googleCredential);
  return mapFirebaseUser(user);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Logout
export const logoutUser = async (): Promise<void> => {
  await GoogleSignin.signOut();
  await auth().signOut();
};

// Auth State Listener
export const subscribeToAuth = (callback: (user: User | null) => void) => {
  return auth().onAuthStateChanged((firebaseUser) => {
    callback(firebaseUser ? mapFirebaseUser(firebaseUser) : null);
  });
};