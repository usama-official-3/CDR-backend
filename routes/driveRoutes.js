const express = require("express");
const router = express.Router();

const {
  getFiles,
  getImages,
  getImage,
  downloadFile

} = require("../controllers/driveController");

router.get("/files", getFiles);
router.get("/images", getImages);
router.get("/image/:id", getImage);
// NEW route for downloading files
router.get("/download/:id", downloadFile);


module.exports = router;