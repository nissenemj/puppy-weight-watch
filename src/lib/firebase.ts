import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBxJxJxJxJxJxJxJxJxJxJxJxJxJxJxJx",
  authDomain: "puppy-weight-watch.firebaseapp.com",
  projectId: "puppy-weight-watch",
  storageBucket: "puppy-weight-watch.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;