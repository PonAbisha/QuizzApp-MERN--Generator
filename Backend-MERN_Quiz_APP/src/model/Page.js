const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  pageNumber: { type: Number, required: true },
  text: { type: String, required: true }
});

module.exports = mongoose.model("Page", pageSchema);
