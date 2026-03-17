// config/drive.js
const { google } = require("googleapis");
const privateKey = process.env.GOOGLE_PRIVATE_KEY;

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: privateKey.includes("\\n")
      ? privateKey.replace(/\\n/g, "\n")
      : privateKey,
  },
  scopes: ["https://www.googleapis.com/auth/drive"],
});

console.log("PRIVATE KEY START:", process.env.GOOGLE_PRIVATE_KEY?.slice(0, 30));
console.log("FOLDER IMG:", process.env.DRIVE_FOLDER_ID_IMAGES);
const drive = google.drive({
  version: "v3",
  auth,
});

module.exports = drive;