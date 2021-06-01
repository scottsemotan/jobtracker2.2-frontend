import firebase from "firebase/app";
import "firebase/auth";

const app = firebase.initializeApp({
  //switch to env.local once finished - this is so Erin and Scott have firebase too
  apiKey: "AIzaSyC0rtYh8Dw3LVgDgxKJuDzKGEG6tATURmA",
  authDomain: "application-tracker-2b514.firebaseapp.com",
  databaseURL: "https://application-tracker-2b514.firebaseio.com",
  projectId: "application-tracker-2b514",
  storageBucket: "application-tracker-2b514.appspot.com",
  messagingSenderId: "763354163533",
  appId: "1:763354163533:web:45a93ffdb0bf5eeb80ef04",
  measurementId: "G-SC2DF0LNQ8"
});

export const auth = app.auth();
export default app;
