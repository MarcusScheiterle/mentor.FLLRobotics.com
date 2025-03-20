// Import Firebase modules
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  updateDoc,
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  DocumentReference,
} from "firebase/firestore";
import axios from "axios";

// Firebase configuration object
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASURE_ID,
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get authentication and Firestore instances
const auth = getAuth(app);
const db = getFirestore(app);

// Create GoogleAuthProvider instance
const googleProvider = new GoogleAuthProvider();

// Function to sign in with Google
const signInWithGoogle = async (): Promise<void> => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const connection = await axios.get("https://api.ipify.org/?format=json");
    const user = res.user;
    const userDocRef = doc(db, "users", user.uid);
    const privateDocRef = doc(userDocRef, "private", "privateUserRecords");
    const publicDocRef = doc(userDocRef, "public", "publicUserRecords");

    // Set user data in Firestore
    await setDoc(
      privateDocRef,
      {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
        connectionIP: connection.data.ip,
      },
      { merge: true }
    );
    await setDoc(publicDocRef, {}, { merge: true });
  } catch (err) {
    console.error(err);
  }
};

// Function to log in with email and password
const logInWithEmailAndPassword = async (
  email: string,
  password: string,
  fields: HTMLCollectionOf<Element>,
  errorMessageField: HTMLElement
): Promise<void> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    errorMessageField.innerHTML = "Error: Email and Password don't match...";
    Array.from(fields).forEach((value) => {
      value.classList.toggle("errored", !value.classList.contains("errored"));
    });
  }
};

// Function to register with email and password
const registerWithEmailAndPassword = async (
  name: string,
  email: string,
  password: string,
  fields: HTMLCollectionOf<Element>,
  errorMessageField: HTMLElement
): Promise<void> => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const connection = await axios.get("https://api.ipify.org/?format=json");
    const user = res.user;
    const userRef = doc(db, "users", user.uid);
    const privateDocRef = doc(userRef, "private", "privateUserRecords");
    const publicDocRef = doc(userRef, "public", "publicUserRecords");

    // Set user data in Firestore
    await setDoc(privateDocRef, {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
      connectionIP: connection.data.ip,
    });
    await setDoc(publicDocRef, {});
  } catch (err) {
    if (err.message.includes("email-already-in-use")) {
      errorMessageField.innerHTML = "Error: Email already in use...";

      Array.from(fields).forEach((parentElement) => {
        const childNodes = parentElement.childNodes;

        for (const node of childNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            if (element.id === "email") {
              parentElement.classList.toggle(
                "errored",
                !parentElement.classList.contains("errored")
              );
              break;
            }
          }
        }
      });
    } else {
      errorMessageField.innerHTML = "Error: Report this to Simpl1f1ed";
    }
  }
};

// Function to send password reset email
const sendPasswordReset = async (
  email: string,
  fields: HTMLCollectionOf<Element>,
  errorMessageField: HTMLElement
): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    if (err.message.includes("user-not-found")) {
      errorMessageField.innerHTML = "Error: Email not recognized...";
    } else {
      errorMessageField.innerHTML = "Error: Report this to Simpl1f1ed";
    }
    Array.from(fields).forEach((value) => {
      if (value.parentElement) {
        value.parentElement.classList.add("errored");
      }
    });
  }
};

// Function to log out the user
const logout = (): void => {
  signOut(auth);
};

// Function to add custom field to a user's document in Firestore using UID
const addCustomFieldToUserByUID = async (
  uid: string,
  subSection: string,
  fieldName: string,
  data: any,
  removeData?: any | any[]
): Promise<void> => {
  try {
    const userRef = doc(
      db,
      "users",
      uid,
      subSection,
      `${subSection}UserRecords`
    );

    if (!userRef) {
      console.error("User document not found");
      return;
    }

    if (Array.isArray(data)) {
      await addDataToArrayField(userRef, fieldName, data);
    } else {
      await setDataToField(userRef, fieldName, data);
    }

    if (removeData) {
      if (Array.isArray(removeData)) {
        await removeDataFromArrayField(userRef, fieldName, removeData);
      } else {
        await removeDataFromField(userRef, fieldName, removeData);
      }
    }
  } catch (err) {
    console.error("Error adding custom field to user:", err);
  }
};

const addDataToArrayField = async (
  userRef: DocumentReference,
  fieldName: string,
  data: any[]
): Promise<void> => {
  await updateDoc(userRef, {
    [fieldName]: arrayUnion(...data),
  });
};

const setDataToField = async (
  userRef: DocumentReference,
  fieldName: string,
  data: any
): Promise<void> => {
  await updateDoc(userRef, {
    [fieldName]: data,
  });
};

const removeDataFromArrayField = async (
  userRef: DocumentReference,
  fieldName: string,
  removeData: any[]
): Promise<void> => {
  await updateDoc(userRef, {
    [fieldName]: arrayRemove(...removeData),
  });
};

const removeDataFromField = async (
  userRef: DocumentReference,
  fieldName: string,
  removeData: any
): Promise<void> => {
  await updateDoc(userRef, {
    [fieldName]: arrayRemove(removeData),
  });
};

const getUserDataByUID = async (
  uid: string,
  subSection: string,
  query: string[]
): Promise<{ data: Record<string, any> | null; error: any }> => {
  try {
    const userRef = doc(
      db,
      "users",
      uid,
      subSection,
      `${subSection}UserRecords`
    );
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const extractedData = {};
      query.forEach((field) => {
        extractedData[field] = userData[field];
      });
      return { data: extractedData, error: null };
    } else {
      return { data: null, error: "User document not found" };
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    return { data: null, error };
  }
};

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  getUserDataByUID,
  addCustomFieldToUserByUID,
};
