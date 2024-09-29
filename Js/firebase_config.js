import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBiLJphZUsLBTFSdVDT_O2HPWbtxIGLGMU",
  authDomain: "sport-buddy-55258.firebaseapp.com",
  projectId: "sport-buddy-55258",
  storageBucket: "sport-buddy-55258.appspot.com",
  messagingSenderId: "597298467816",
  appId: "1:597298467816:web:d81ce91e86d59baed98a5d",
  measurementId: "G-NK2MGEC97V"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app)

export { auth, db, storage };
