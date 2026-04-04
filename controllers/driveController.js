// const drive = require("../config/drive");

// const FOLDER_ID_CDR = "11aoWtBLasHtplPllAvS-yh1AkKM9fERi";
// const FOLDER_ID_IMAGES = "1Ak2lr5DMctZOABXFvpltoKNV2_IG9axj";

// exports.getFiles = async (req, res) => {
//   try {
//     const response = await drive.files.list({
//       q: `'${FOLDER_ID_CDR}' in parents and trashed = false`,
//       fields: "files(id,name,mimeType)",
//       pageSize: 1000
//     });

//     const files = response.data.files.map(file => ({
//       id: file.id,
//       name: file.name,
//       url: `https://drive.google.com/uc?export=view&id=${file.id}`
//     }));

//     res.json({ files });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getImages = async (req, res) => {
//   try {
//     const response = await drive.files.list({
//       q: `'${FOLDER_ID_IMAGES}' in parents and trashed = false`,
//       fields: "files(id,name,mimeType)",
//       pageSize: 1000
//     });

//     const files = response.data.files.map(file => ({
//       id: file.id,
//       name: file.name,
//       url: `https://drive.google.com/uc?export=view&id=${file.id}`
//     }));

//     res.json({ files });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getImage = async (req, res) => {
//   try {
//     const response = await drive.files.get(
//       { fileId: req.params.id, alt: "media" },
//       { responseType: "stream" }
//     );

//     res.setHeader("Content-Type", "image/jpeg");

//     response.data.pipe(res);

//   } catch (error) {
//     res.status(500).send("Error loading image");
//   }
// };

const drive = require("../config/drive");
const sharp = require("sharp");

const FOLDER_ID_CDR = process.env.DRIVE_FOLDER_ID_CDR;
const FOLDER_ID_IMAGES = process.env.DRIVE_FOLDER_ID_IMAGES;

/* ---------------------------------------------------
   GET ALL CDR FILES
--------------------------------------------------- */
exports.getFiles = async (req, res) => {
  try {
    const response = await drive.files.list({
      q: `'${FOLDER_ID_CDR}' in parents and trashed=false`,
      fields: "files(id,name,mimeType)",
      pageSize: 1000
    });

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const files = response.data.files.map((file) => ({
      id: file.id,
      name: file.name,
      url: `${baseUrl}/api/drive/download/${file.id}?name=${encodeURIComponent(file.name)}`
    }));

    res.json({ files });

  } catch (error) {
    console.error("Drive getFiles error:", error.message);
    res.status(500).json({ error: "Failed to fetch files" });
  }
};


/* ---------------------------------------------------
   GET ALL IMAGES
--------------------------------------------------- */
exports.getImages = async (req, res) => {
  try {
    const response = await drive.files.list({
      q: `'${FOLDER_ID_IMAGES}' in parents and trashed=false`,
      fields: "files(id,name,mimeType)",
      pageSize: 1000
    });

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const files = response.data.files.map((file) => ({
      id: file.id,
      name: file.name,
      url: `${baseUrl}/api/drive/image/${file.id}`
    }));

    res.json({ files });

  } catch (error) {
    console.error("Drive getImages error:", error.message);
    res.status(500).json({ error: "Failed to fetch images" });
  }
};


/* ---------------------------------------------------
   STREAM IMAGE
--------------------------------------------------- */
// exports.getImage = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const response = await drive.files.get(
//       { fileId: id, alt: "media" },
//       { responseType: "stream" }
//     );

//     res.setHeader("Content-Type", "image/jpeg");

//     response.data.pipe(res);

//   } catch (error) {
//     console.error("Drive getImage error:", error.message);
//     res.status(500).send("Error loading image");
//   }
// };
exports.getImage = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ query params (optional)
    const width = parseInt(req.query.w) || 400;
    const quality = parseInt(req.query.q) || 70;

    // Get image from Google Drive
    const response = await drive.files.get(
      { fileId: id, alt: "media" },
      { responseType: "arraybuffer" }
    );

    const buffer = Buffer.from(response.data);

    // ✅ Resize + compress
    const optimized = await sharp(buffer)
      .resize({ width })
      .webp({ quality }) 
      .toBuffer();

    // ✅ Headers
    res.setHeader("Content-Type", "image/webp");
    res.setHeader("Cache-Control", "public, max-age=31536000"); 

    res.send(optimized);

  } catch (error) {
    console.error("Drive getImage error:", error.message);
    res.status(500).send("Error loading image");
  }
};


/* ---------------------------------------------------
   DOWNLOAD FILE
--------------------------------------------------- */
exports.downloadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.query;

    const response = await drive.files.get(
      { fileId: id, alt: "media" },
      { responseType: "stream" }
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${name || "download"}"`
    );

    response.data.pipe(res);

  } catch (error) {
    console.error("Drive download error:", error.message);
    res.status(500).send("Error downloading file");
  }
};