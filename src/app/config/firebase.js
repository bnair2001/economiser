import firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDi_0DTRvYvXUzP5vzzXta-Zx8ScYcPkPQ",
    authDomain: "economiser-edf6a.firebaseapp.com",
    databaseURL: "https://economiser-edf6a.firebaseio.com",
    projectId: "economiser-edf6a",
    storageBucket: "economiser-edf6a.appspot.com",
    messagingSenderId: "284793194810"
}

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const settings = {
  timestampsInSnapshots: true
}
firestore.settings(settings)
export default firebase;