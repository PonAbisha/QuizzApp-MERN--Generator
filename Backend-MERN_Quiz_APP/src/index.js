// ================= IMPORTS =================

require("dotenv").config();

const fs = require("fs");

const express = require("express");

const connect = require("./configs/db.js");

const bodyParser = require("body-parser");

const cors = require("cors");


// ================= CONTROLLERS =================

const loginAuth = require("./controller/auth.controller.js");

const quizAdd = require("./controller/quizAdd.controller.js");

const quiz = require("./controller/displayQuiz.controller.js");

const userResult = require("./controller/userData.controller.js");


// ================= MODELS =================

const Book = require("./model/Book");

const Page = require("./model/Page");

const Question = require("./model/Question");


// ================= UTILS =================

const upload = require("./upload");

const { extractText } = require("./utils/extractText.js");

const {
  generateMcqsFromText,
} = require("./utils/mcqgenerator");


// ================= MIDDLEWARE =================

const authMiddleware = require("./middleware/auth.middleware");


// ================= APP =================

const app = express();

const PORT = process.env.PORT || 5000;


// ================= MIDDLEWARE SETUP =================

app.use(cors());

app.use(
  express.json({
    limit: "50mb",
  })
);

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


// STATIC UPLOADS
app.use(
  "/uploads",
  express.static("uploads")
);


// ================= TEST ROUTE =================

app.get("/", (req, res) => {

  res.send(
    "Welcome! Backend API is working..."
  );

});


// ================= GET PAGES =================

app.get(
  "/pages/:bookId",

  authMiddleware,

  async (req, res) => {

    try {

      const pages = await Page.find({
        bookId: req.params.bookId,
      }).sort("pageNumber");

      res.status(200).json(pages);

    } catch (err) {

      console.error(err);

      res.status(500).json({
        message: err.message,
      });

    }

  }
);


// ================= GET BOOKS =================

app.get(
  "/books",

  authMiddleware,

  async (req, res) => {

    try {

      const books = await Book.find();

      res.status(200).json(books);

    } catch (err) {

      console.error(err);

      res.status(500).json({
        message: "Failed to fetch books",
      });

    }

  }
);


// ================= DELETE BOOK =================

async function deleteBookHandler(req, res) {

    try {

      const { bookId } = req.params;

      const book = await Book.findById(bookId);

      if (!book) {

        return res.status(404).json({
          message: "Book not found",
        });

      }

      await Promise.all([
        Page.deleteMany({ bookId }),
        Question.deleteMany({ bookId }),
      ]);

      await Book.findByIdAndDelete(bookId);

      if (
        book.filePath &&
        fs.existsSync(book.filePath)
      ) {
        fs.unlinkSync(book.filePath);
      }

      return res.status(200).json({
        message: "Book deleted successfully",
      });

    } catch (err) {

      console.error(
        "DELETE BOOK ERROR:",
        err
      );

      return res.status(500).json({
        message:
          err.message ||
          "Failed to delete book",
      });

    }

}

app.delete(
  "/books/:bookId",
  authMiddleware,
  deleteBookHandler
);

app.post(
  "/books/:bookId/delete",
  authMiddleware,
  deleteBookHandler
);


// ================= GET QUESTIONS =================

app.get(
  "/questions/:bookId",

  authMiddleware,

  async (req, res) => {

    try {

      const { bookId } = req.params;

      const questions =
        await Question.find({ bookId });

      res.status(200).json(questions);

    } catch (err) {

      console.error(err);

      res.status(500).json({
        message: err.message,
      });

    }

  }
);


// ================= UPLOAD PDF =================

app.post(

  "/upload/file",

  authMiddleware,

  upload.single("image"),

  async (req, res) => {

    try {

      // DEBUG
      console.log(
        "TOKEN:",
        req.headers.authorization
      );

      console.log(
        "FILE:",
        req.file
      );

      // CHECK FILE
      if (!req.file) {

        return res.status(400).json({
          message: "No file uploaded",
        });

      }

      // EXTRACT TEXT
      const { fullText, pagesList } = await extractText(
        req.file.path
      );

      console.log(
        "TEXT LENGTH:",
        fullText.length
      );

      console.log(
        "TEXT PREVIEW:",
        fullText.slice(0, 500)
      );

      // CHECK EXTRACTED TEXT
      if (
        !fullText ||
        fullText.trim().length < 20
      ) {

        return res.status(400).json({

          message:
            "Could not extract readable text from PDF, even after OCR. Try a clearer scan.",

        });

      }

      // CREATE BOOK
      const book = await Book.create({

        title: req.file.originalname,

        filePath: req.file.path,

      });

      // GET EXTRACTED PAGES
      const pages = pagesList.filter(
        (p) =>
          p &&
          p.text &&
          p.text.trim().length > 10
      );

      console.log(
        "TOTAL PAGES:",
        pages.length
      );

      let pageDocs = [];

      for (
        let i = 0;
        i < pages.length;
        i++
      ) {

        pageDocs.push({

          bookId: book._id,

          pageNumber: pages[i].pageNumber || i + 1,

          text: pages[i].text,

        });

      }

      // SAVE PAGES
      if (pageDocs.length > 0) {

        await Page.insertMany(
          pageDocs
        );

      }

      console.log(
        "PAGES SAVED:",
        pageDocs.length
      );

      // PREVIEW
      const firstNonEmpty =
        pages[0]?.text || "";

      // RESPONSE
      return res.status(200).json({

        message:
          "Book uploaded and pages extracted successfully",

        totalPages:
          pageDocs.length,

        bookId: book._id,

        preview:
          firstNonEmpty.slice(0, 300),

      });

    } catch (err) {

      console.error(
        "UPLOAD ERROR:",
        err
      );

      return res.status(500).json({

        message:
          err.message ||
          "Text extraction failed",

      });

    }

  }
);


// ================= GENERATE QUESTIONS =================

app.post(

  "/generate-questions/:bookId",

  authMiddleware,

  async (req, res) => {

    try {

      const { bookId } = req.params;

      const { limit, difficulty } = req.body;

      const maxCount =
        Math.min(
          Math.max(Number(limit) || 20, 5),
          50
        );

      const questionDifficulty =
        ["easy", "medium", "hard"].includes(difficulty)
          ? difficulty
          : "medium";

      // GET PAGES
      let pages = await Page.find({
        bookId,
      }).sort({
        pageNumber: 1,
      });

      console.log(
        "FOUND PAGES:",
        pages.length
      );

      if (!pages.length) {
        const book = await Book.findById(bookId);

        if (book && book.filePath) {
          const { pagesList } = await extractText(book.filePath);

          const pageDocs = pagesList
            .filter(
              (p) =>
                p &&
                p.text &&
                p.text.trim().length > 10
            )
            .map((p, index) => ({
              bookId,
              pageNumber: p.pageNumber || index + 1,
              text: p.text,
            }));

          if (pageDocs.length) {
            await Page.insertMany(pageDocs);

            pages = await Page.find({
              bookId,
            }).sort({
              pageNumber: 1,
            });
          }
        }
      }

      if (!pages.length) {

        return res.status(404).json({

          message:
            "No readable pages found for this book",

        });

      }

      // FULL TEXT
      const fullText = pages

        .map((p) => p.text)

        .join("\n");

      // GENERATE QUESTIONS
      const mcqs =
        generateMcqsFromText(
          fullText,
          maxCount,
          questionDifficulty
        );

      if (!mcqs.length) {

        return res.status(400).json({

          message:
            "Not enough text to generate questions",

        });

      }

      // SAVE QUESTIONS
      const docsToSave =
        mcqs.map((q) => {

          // Find the physical page containing the original sentence
          const matchingPage = pages.find(
            (p) =>
              p.text &&
              p.text.includes(q.sentence)
          );

          const pageNumbers = matchingPage
            ? [matchingPage.pageNumber]
            : [];

          return {

            bookId,

            pageNumbers,

            questionText:
              q.questionText,

            options: q.options,

            correctIndex:
              q.correctIndex,

            difficulty:
              q.difficulty ||
              questionDifficulty,

          };

        });

      await Question.deleteMany({
        bookId,
      });

      const savedQuestions =
        await Question.insertMany(
          docsToSave
        );

      // RESPONSE
      res.status(200).json({

        message:
          "Questions generated successfully",

        count:
          savedQuestions.length,

        difficulty:
          questionDifficulty,

        questions:
          savedQuestions,

      });

    } catch (err) {

      console.error(
        "QUESTION GENERATION ERROR:",
        err
      );

      res.status(500).json({

        message:
          err.message ||
          "Failed to generate questions",

      });

    }

  }
);


// ================= OTHER ROUTES =================

app.use("/", loginAuth);

app.use("/admin", quizAdd);

app.use("/quiz", quiz);

app.use("/userResult", userResult);

app.use("/user", userResult);


// ================= START SERVER =================

const startServer = async () => {

  try {

    await connect();

    console.log(
      "Connected to Database"
    );

    app.listen(PORT, () => {

      console.log(
        `Server running at http://localhost:${PORT}`
      );

    });

  } catch (err) {

    console.error(
      "Database connection failed:",
      err
    );

    process.exit(1);

  }

};

startServer();
