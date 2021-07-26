/*
This scripts contains the interfaces to Firebase, a document-based NoSQL database.
Specific users' messages and interactions are stored there for state management and future reference

*/

const admin = require("firebase-admin");
const config = require('../config');
const moment = require('moment');
const serviceAccount = require(`../keys/${config.firebasePrivateKey}`);

//initialize the app
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://timesheet-requests-default-rtdb.europe-west1.firebasedatabase.app"
});

// define object reference
const db = admin.database();
const ref = db.ref('/');

// --------1.) function to save a timelog request by user into DB-----------
const saveTimelogRequest = (userId, item) => {
    const response = ref.push({
      userId,
      item,
      timestamp: moment().valueOf()
    });
    
    return response.key;
};

// --------2.) function to save a timelog decision by manager into DB-----------
const recordTimelogRequestDecision = (key, decision) => {
  const updateObject = ref.child(key);
  updateObject.update({ //not set!!
    decision
  });
}

// --------3.) function to save a submission decision by user into DB-----------
const recordTimelogSubmission= (key, submission) => {
  const updateObject = ref.child(key);
  updateObject.update({ //not set!!
    submission
  });
} 

// --------4.) function to retrieve a particular timelog entry by key from DB----------
const readTimelogRequest = async (key) => {
    const snapshot = await ref.child(key).once('value');
    return snapshot.val();
}

// --------5.) function to retrieve all timelog entries from DB----------
const readAllTimelogRequests = async () => {
  const snapshot = await ref.once('value');
  return snapshot.val();
}


module.exports = {
  saveTimelogRequest,
  readTimelogRequest,
  recordTimelogRequestDecision,
  recordTimelogSubmission,
  readAllTimelogRequests
}