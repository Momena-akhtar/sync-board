
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider,
    GithubAuthProvider, 
    signInAnonymously ,
    signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCJJLxKIhzsCiKoRAvelzvKypQ3KwYPHgA",
    authDomain: "sync-b8a10.firebaseapp.com",
    projectId: "sync-b8a10",
    storageBucket: "sync-b8a10.firebasestorage.app",
    messagingSenderId: "870471826011",
    appId: "1:870471826011:web:dd67ca3b7fbc3c43161d7e",
    measurementId: "G-PXXV11ZZ5Z"
  };
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("User Info:", result.user);
    return result.user; // Returns user data
  } catch (error) {
    console.error("Google Sign-In Error:", error);
  }
};
export const signInWithGitHub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    console.log("GitHub Login Success:", result.user);
    return result.user;
  } catch (error) {
    console.error("GitHub Login Error:", error);
  }
};
export const signInAsGuest = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    console.log("Guest User:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Anonymous Sign-In Error:", error);
  }
};