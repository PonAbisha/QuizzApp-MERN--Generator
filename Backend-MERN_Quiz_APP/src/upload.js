const multer = require("multer");
const path = require("path");
const fs = require("fs");
 
const uploadDir = path.join(__dirname, "../uploads");
 
// Ensure the uploads directory exists — it's gitignored, so a fresh clone
// (e.g. a Render deploy) won't have it on disk unless we create it here.
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
 
const storage = multer.diskStorage({
 
  destination: (req, file, cb) => {
 
    cb(null, uploadDir);
 
  },
 
  filename: (req, file, cb) => {
 
    const extension = path.extname(file.originalname);
 
    const newName = `${Date.now()}${extension}`;
 
    cb(null, newName);
 
  },
 
});
 
module.exports = multer({ storage });
