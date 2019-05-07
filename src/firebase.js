/* eslint-disable class-methods-use-this */
/* eslint-disable no-shadow */
import moment from 'moment';
import firebase from 'firebase/app';
import 'firebase/firebase-auth';
import 'firebase/firebase-database';


const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
};

firebase.initializeApp(config);

export default class {
  userState() {
    return new Promise((resolve) => {
      firebase.auth().onAuthStateChanged(user => resolve(user));
    });
  }

  signUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => { resolve(email); })
        .catch(error => reject(error));
    });
  }

  signIn() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => { resolve(email); })
        .catch(error => reject(error));
    });
  }

  signOut() {
    return new Promise((resolve, reject) => {
      firebase.auth().signOut()
        .then(resolve())
        .catch(error => reject(error));
    });
  }

  writeDB(value, day) {
    const { uid } = firebase.auth().currentUser;
    firebase
      .database()
      .ref(`history/${uid}/${day}`)
      .set(value);
  }

  readDB() {
    const { uid } = firebase.auth().currentUser;
    const dayCounts = [];
    for (let i = 0; i < 8; i += 1) {
      const days = moment().subtract(i, 'days').format('YYYY-MM-DD');
      firebase.database()
        .ref(`history/${uid}/${days}`)
        .on('value', (snapshot) => {
          dayCounts[i] = snapshot.val();
        });
    }
    console.log(dayCounts);
    return dayCounts;
  }
}
