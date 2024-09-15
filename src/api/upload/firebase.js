// firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./firebaseServiceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'jbj-fintech.appspot.com',
});

const bucket = admin.storage().bucket();

module.exports = bucket;
