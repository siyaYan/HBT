// import { initializeApp } from 'firebase/app';
// // import { getMessaging, getToken, onMessage } from "firebase/messaging";

// import { 
//   FIREBASE_API_KEY, 
//   FIREBASE_AUTH_DOMAIN, 
//   FIREBASE_PROJECT_ID, 
//   FIREBASE_STORAGE_BUCKET, 
//   FIREBASE_MESSAGING_SENDER_ID, 
//   FIREBASE_APP_ID, 
//   FIREBASE_MEASUREMENT_ID 
// } from '@env';

// const firebaseConfig = {
//   apiKey: FIREBASE_API_KEY,
//   authDomain: FIREBASE_AUTH_DOMAIN,
//   projectId: FIREBASE_PROJECT_ID,
//   storageBucket: FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
//   appId: FIREBASE_APP_ID,
//   measurementId: FIREBASE_MEASUREMENT_ID,
// };

// const app = initializeApp(firebaseConfig);
// // const messaging = getMessaging(app);
// export default app;
// export { messaging };


import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
// import "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCUcdfsmB6eqkaUPQ0xH2ELm4mqA9MhHJ4",
  authDomain: "habital-e1c8d.firebaseapp.com",
  projectId: "habital-e1c8d",
  storageBucket: "habital-e1c8d.appspot.com",
  messagingSenderId: "720818502811",
  appId: "1:720818502811:web:6516136f1df011ce289a3e",
  measurementId: "G-EVZCE105VF"
};

const app = initializeApp(firebaseConfig);
