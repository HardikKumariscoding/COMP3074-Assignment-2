import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDrP0VeoNO-z_t63TdPpDLaCVn3qtbhG0A",
  authDomain: "capstone-techbarter.firebaseapp.com",
  projectId: "capstone-techbarter",
  storageBucket: "capstone-techbarter.appspot.com",
  messagingSenderId: "293797610538",
  appId: "1:293797610538:web:86b103619a28bb0d286f53",
  measurementId: "G-MFW41507K0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
