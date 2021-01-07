import firebase from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDL-VVhiybcEmhxchqJTLLr4A5t06lLRW4",
    authDomain: "forks-9a6ed.firebaseapp.com",
    databaseURL: "https://forks-9a6ed.firebaseio.com",
    projectId: "forks-9a6ed",
    storageBucket: "forks-9a6ed.appspot.com",
    messagingSenderId: "166392269014",
    appId: "1:166392269014:web:d244bbe82f99295e9d6177"
};
export const firebaseApp = firebase.initializeApp(firebaseConfig);