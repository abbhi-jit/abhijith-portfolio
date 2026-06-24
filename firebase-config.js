/* ========================================
   FIREBASE CONFIGURATION
   ======================================== */

const firebaseConfig = {
  apiKey: "AIzaSyCb-WEZDPTysoxlEOiTMBHg2AAuRw2QDhU",
  authDomain: "portfolio-d04fd.firebaseapp.com",
  projectId: "portfolio-d04fd",
  storageBucket: "portfolio-d04fd.firebasestorage.app",
  messagingSenderId: "246818096699",
  appId: "1:246818096699:web:fadde7696a7f3740ca3e1e",
  measurementId: "G-BYVN53J8VY"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
