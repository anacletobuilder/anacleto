console.log("[firebase-config] loading firebase-admin...");
const admin = require("firebase-admin");

console.log("[firebase-config] loading googleServiceAccount...");

const serviceAccount = JSON.parse(process.env.FIREBASE_SERIVCE_ACCOUNT);
//ex: {"type":"service_account","project_id":"XXXX","private_key_id":"XXXXX","private_key":"-----BEGIN PRIVATE KEY-----\nxxxx\n-----END PRIVATE KEY-----\n","client_email":"xxxx.iam.gserviceaccount.com","client_id":"xxx","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/xxxxx.iam.gserviceaccount.com"};

console.log("[firebase-config] initializeApp...");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;