const express = require("express");

const router = express.Router();

const PostQuiz = require("../model/quizdata.model.js");


// ================ ADD QUIZ =================

router.post("/", async (req, res) => {

  try {

    if (!req.body.title) {
      return res.status(400).json({
        message: "Quiz title required",
      });
    }

    const data = await PostQuiz.create(req.body);

    res.status(201).json(data);

  } catch (err) {

    res.status(400).json({
      message: err.message,
    });

  }
});


// ================ GET QUIZ =================

router.get("/:value", async (req, res) => {

  try {

    const data = await PostQuiz.find({
      title: req.params.value,
    });

    res.status(200).json(data);

  } catch (err) {

    res.status(400).json({
      message: err.message,
    });

  }
});

module.exports = router;