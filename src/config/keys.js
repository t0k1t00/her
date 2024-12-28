import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCGG7hO0eaV0brhfR6X5EQNg4h1Opt-IzY",
  projectId: "healthyher-9ef94",
  storageBucket: "healthyher-9ef94.firebasestorage.app",
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
export const db = getFirestore(app);