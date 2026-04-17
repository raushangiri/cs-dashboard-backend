const admin = require("firebase-admin");
const serviceAccount = require("./jbj-fintech-firebase-adminsdk-e6m8i-6fd0400752.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "jbj-fintech.appspot.com"
});

async function test() {
  const bucket = admin.storage().bucket();
  const [files] = await bucket.getFiles({ maxResults: 1 });

  console.log(files);
}

test();