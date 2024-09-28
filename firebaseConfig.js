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
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
