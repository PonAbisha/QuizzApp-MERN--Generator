const express = require("express");

const router = express.Router();

const Postquiz = require("../model/quizdata.model.js");

router.get("/", async (req, res) => {

  try {

    const Postquizdata = await Postquiz
      .find()
      .lean()
      .exec();

    res.status(200).json(Postquizdata);

  } catch (err) {

    return res.status(500).json({
      message: err.message,
    });

  }
});

module.exports = router;