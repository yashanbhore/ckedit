// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore , serverTimestamp} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJOUHrUX0CDMv4NrYJKoKlZ7w7IwmfHG8",
  authDomain: "ckblog-5137b.firebaseapp.com",
  projectId: "ckblog-5137b",
  storageBucket: "ckblog-5137b.appspot.com",
  messagingSenderId: "1015776160194",
  appId: "1:1015776160194:web:980c0973c5dba34a7b4e5b",
  measurementId: "G-LWMF3YT63B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const imageDb = getStorage(app);
const db = getFirestore(app);
export {imageDb, db, serverTimestamp};