const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, path.join(__dirname, "../uploads"));

  },

  filename: (req, file, cb) => {

    const extension = path.extname(file.originalname);

    const newName = `${Date.now()}${extension}`;

    cb(null, newName);

  },

});

module.exports = multer({ storage });