import { initializeApp } from 'firebase/app';

import { browserLocalPersistence, getAuth, setPersistence } from 'firebase/auth';

import { getFirestore } from 'firebase/firestore';

import { firebaseConfig } from './firebase.config';

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;
