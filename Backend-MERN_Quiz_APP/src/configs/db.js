const mongoose = require('mongoose');
require("dotenv").config();

module.exports = async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log(" Database connected successfully");
  } catch (err) {
    console.error(" Database connection error:", err);
    process.exit(1);
  }
};
