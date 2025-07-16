import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// ✅ Firebase configuration (from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBrd4ea0Y3iXhZItepgP-m-Y-KMbGnMvPI",
  authDomain: "swiftsql-ef773.firebaseapp.com",
  projectId: "swiftsql-ef773",
  storageBucket: "swiftsql-ef773.appspot.com",
  messagingSenderId: "710289906823",
  appId: "1:710289906823:web:c639c916585f6b271bac22"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Set up Firebase Authentication
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });  // Always prompt for account selection

// ✅ Export for use in other parts of the app
export { auth, provider, app };
