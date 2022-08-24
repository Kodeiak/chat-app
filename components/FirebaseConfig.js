import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB4aNoVrNn8nECgPJk66j-fmXZJ-aduvcQ",
  authDomain: "test-65934.firebaseapp.com",
  projectId: "test-65934",
  storageBucket: "test-65934.appspot.com",
  messagingSenderId: "997041391762",
  appId: "1:997041391762:web:13c476cb0bc1493a7e3e4b",
  measurementId: "G-3D68KQ28DD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);