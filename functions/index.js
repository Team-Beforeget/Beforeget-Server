const serviceAccount = require("./appjam-beforeget-firebase-adminsdk-iqdmx-00e36d973f");
const admin = require("firebase-admin");
const dotenv = require("dotenv");

dotenv.config();

let firebase;
if (admin.apps.length === 0) {
  firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  firebase = admin.app();
}

module.exports = {
  api: require("./src"),
};
