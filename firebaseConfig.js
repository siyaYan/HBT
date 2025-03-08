import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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
const messaging = getMessaging(app);
export default app;
export { messaging };