// config/drive.js
const { google } = require("googleapis");

const privateKey = process.env.GOOGLE_PRIVATE_KEY;

if (!privateKey) {
  console.error("❌ GOOGLE_PRIVATE_KEY is missing");
}

const formattedKey = privateKey
  ? privateKey.includes("\\n")
    ? privateKey.replace(/\\n/g, "\n")
    : privateKey
  : "";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: formattedKey,
  },
  scopes: ["https://www.googleapis.com/auth/drive"],
});

console.log("PRIVATE KEY START:", privateKey?.slice(0, 30));
console.log("FOLDER IMG:", process.env.DRIVE_FOLDER_ID_IMAGES);

const drive = google.drive({
  version: "v3",
  auth,
});

module.exports = drive;