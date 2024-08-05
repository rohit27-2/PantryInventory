// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9R3vSbX7QfvRAzKVNX47nHDApHG5sOa4",
  authDomain: "inventory-management-app-64e3d.firebaseapp.com",
  projectId: "inventory-management-app-64e3d",
  storageBucket: "inventory-management-app-64e3d.appspot.com",
  messagingSenderId: "269752401200",
  appId: "1:269752401200:web:4e10888c96accdd7725cf5",
  measurementId: "G-B7P955D190"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export {
  app, firebaseConfig, db
}