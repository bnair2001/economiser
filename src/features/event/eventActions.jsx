import { toastr } from 'react-redux-toastr';
import { DELETE_EVENT, FETCH_EVENTS } from './eventConstants';
import { asyncActionStart, asyncActionFinish, asyncActionError } from '../async/asyncActions';
import { fetchSampleData } from '../../app/data/mockAPI';
import { createNewEvent } from '../../app/common/util/helpers';
import moment from 'moment';
import firebase from '../../app/config/firebase';
import { createSum } from '../../app/common/util/helpers'
export const createEvent = event => {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const user = firestore.auth().currentUser;
    const photoURL = getState().firebase.profile.photoURL;
    let newEvent = createNewEvent(user, photoURL, event);
    
    try {
      let createdEvent = await firestore.add(`events`, newEvent);
      await firestore.set(`event_attendee/${createdEvent.id}_${user.uid}`, {
        eventId: createdEvent.id,
        userUid: user.uid,
        eventDate: event.date,
        host: true
      });
      toastr.success('Success', 'Transaction has been created');
    } catch (error) {
      toastr.error('Oops', 'Something went wrong');
    }
  };
};

export const updateEvent = event => {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    if (event.date !== getState().firestore.ordered.events[0].date) {
      event.date = moment(event.date).toDate();
    }
    try {
      await firestore.update(`events/${event.id}`, event);
      toastr.success('Success', 'Transaction has been updated');
    } catch (error) {
      console.log(error);
      toastr.error('Oops', 'Something went wrong');
    }
  };
};

export const cancelToggle = (cancelled, eventId) => async (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();
  const message = cancelled
    ? 'Are you sure you want to removed the Transaction?'
    : 'This re-add the transaction - are you sure?';
  try {
    toastr.confirm(message, {
      onOk: () =>
        firestore.update(`events/${eventId}`, {
          cancelled: cancelled
        })
    });
  } catch (error) {
    console.log(error);
  }
};

export const getEventsForDashboard = lastEvent => async (dispatch, getState, {getFirestore}) => {
  let today = new Date(Date.now());
  const firestore = firebase.firestore();
  const user = getFirestore().auth().currentUser;
  const eventsRef = firestore.collection('events');
  
 
  try {
    dispatch(asyncActionStart());
    let startAfter =
      lastEvent &&
      (await firestore
        .collection('events')
        .doc(lastEvent.id)
        .get());
    let query;

    lastEvent
      ? (query = eventsRef
          .where('date', '>=', today)
          .orderBy('date')
          .startAfter(startAfter)
          .limit(1))
      : (query = eventsRef
          .where('date', '>=', today)
          .orderBy('date')
          .limit(4));
    
    let querySnap = await query.get();

    if (querySnap.docs.length === 0) {
      dispatch(asyncActionFinish());
      return querySnap;
    }

    let events = [];
let sum_of_expenses=0;
    for (let i = 0; i < querySnap.docs.length; i++) {
      let evt = { ...querySnap.docs[i].data(), id: querySnap.docs[i].id };
      events.push(evt);

      sum_of_expenses = sum_of_expenses+parseInt(evt.description);
      

    }
    let ans = {
      'Sum':sum_of_expenses
    }
    
    try {
      await getFirestore().set(`${user.uid}/spent`, ans);
      toastr.success('Success', 'Transactions has ben updated');
    } catch (error) {
      console.log(error);
      toastr.error('Oops', 'Something went wrong');
    }


    dispatch({ type: FETCH_EVENTS, payload: { events } });
    dispatch(asyncActionFinish());
    return querySnap;
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
  }
};


// export const getIncomeForDashboard = evt => async (dispatch, getState, {getFirestore}) => {
//   let today = new Date(Date.now());
//   const firestore = firebase.firestore();
//   const user = getFirestore().auth().currentUser;
//   const eventsRef = firestore.collection(user.uid);
  
//   const admin = require('firebase-admin');

//   var serviceAccount = require('../../../src/app/config/firebase.js');
  
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
//   });
  
//   var db = admin.firestore();
//   try {
//     dispatch(asyncActionStart());
//     let query;
//     var incomeRef= db.collection(user.uid).doc('spent');
//     var getDoc = incomeRef.get()
//     .then(doc => {
//       if (!doc.exists) {
//         console.log('No such document!');
//       } else {
//         console.log('Document data:', doc.data());
//         query=doc.data();
//       }
//     })
//     .catch(err => {
//       console.log('Error getting document', err);
//     });
      
//     //let querySnap = query.get();

//     // if (querySnap.docs.length === 0) {
//     //   dispatch(asyncActionFinish());
//     //   return querySnap;
//     // }
//     // console.log(querySnap)
  
//     dispatch(asyncActionFinish());
//     return query;
//   } catch (error) {
//     console.log(error);
//     dispatch(asyncActionError());
//   }
// };





export const addEventComment = (eventId, values, parentId) => 
  async (dispatch, getState, {getFirebase}) => {
    const firebase = getFirebase();
    const profile = getState().firebase.profile;
    const user = firebase.auth().currentUser;
    let newComment = {
      parentId: parentId,
      displayName: profile.displayName,
      photoURL: profile.photoURL || '/assets/user.png',
      uid: user.uid,
      text: values.comment,
      date: Date.now()
    }
    try {
      await firebase.push(`event_chat/${eventId}`, newComment)
    } catch (error) {
      console.log(error);
      toastr.error('Oops', 'Problem adding comment')
    }
  }