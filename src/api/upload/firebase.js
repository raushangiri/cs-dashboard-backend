// firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('../../../jbj-fintech-firebase-adminsdk-e6m8i-6fd0400752.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'jbj-fintech.appspot.com',
});

const bucket = admin.storage().bucket();

module.exports = bucket;
