const { getAuth } =require('firebase/auth');
// Import the functions you need from the SDKs you need
const { initializeApp } =require( "firebase/app");
const { getAnalytics } =require( "firebase/analytics");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQzCnhjak1ZAbgm2doOcvjnvs6TcWDVOs",
  authDomain: "cashirin-e20f3.firebaseapp.com",
  projectId: "cashirin-e20f3",
  storageBucket: "cashirin-e20f3.appspot.com",
  messagingSenderId: "844049552205",
  appId: "1:844049552205:web:8871572b30144aca4a9d04",
  measurementId: "G-8KDZZ1FMWD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
module.exports = {auth};