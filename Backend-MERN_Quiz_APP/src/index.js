// 1. Imports at top 
const express = require("express");
const connect = require("./configs/db.js"); // adjust if configs is outside
const bodyParser = require("body-parser");
const cors = require("cors");
const loginAuth = require("./controller/auth.controller.js");
const quizAdd = require("./controller/quizAdd.controller.js");
const quiz = require("./controller/displayQuiz.controller.js");
const userResult = require("./controller/userData.controller.js");
const Book = require("./model/Book");
const  upload  = require("./upload");
const { extractText }  = require("./utils/extractText.js");
const Page = require("./model/Page");
const Question = require("./model/Question");
const { generateMcqsFromText } = require("./utils/mcqgenerator");


const authMiddleware = require("./middleware/auth.middleware");

// 2. Initialize app and port 
const app = express();
const PORT = process.env.PORT || 5000;  //  use only one backend port

// 3. Middleware must come BEFORE routes 
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // fixes body-parser warning

// 4. Routes 
app.get("/", (req, res) => {
  res.send("Welcome! Backend API is working...");
});
app.get("/pages/:bookId",authMiddleware, async (req, res) => {
  const pages = await Page.find({ bookId: req.params.bookId }).sort("pageNumber");
  res.json(pages);
});

app.get("/books",authMiddleware, async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch books" });
  }
});

app.get("/questions/:bookId",authMiddleware, async (req, res) => {
  const { bookId } = req.params;
  const questions = await Question.find({ bookId });
  res.json(questions);
});

app.post("/upload/file", upload.single("image"),authMiddleware, async (req, res) => {
  try {
    console.log("Uploaded File:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Extract full text from PDF
    const text = await extractText(req.file.path);

    // Create book entry
    const book = await Book.create({
      title: req.file.originalname,
      filePath: req.file.path
    });

    // Split into pages (approx, by form-feed or large chunk)
    const pages = text.split(/\f|\n\s*\n/g);  // split by blank lines or page breaks

    let pageDocs = [];

    for (let i = 0; i < pages.length; i++) {
      if (pages[i].trim().length === 0) continue;

      pageDocs.push({
        bookId: book._id,
        pageNumber: i + 1,
        text: pages[i]
      });
    }

    const firstNonEmpty = pages.find(p => p && p.trim().length > 0) || "";
    await Page.insertMany(pageDocs);

    return res.json({
      message: "Book saved & pages extracted",
      totalPages: pageDocs.length,
      bookId: book._id,
      preview: firstNonEmpty.slice(0, 300)
    });
  } catch (err) {
    console.error("Extract error:", err);
    res.status(500).json({ message: "Text extraction failed" });
  }
});

// Generate MCQs for a given bookId
app.post("/generate-questions/:bookId", authMiddleware,async (req, res) => {
  try {
    const { bookId } = req.params;
    const { limit } = req.body; // optional: questions count
    const maxCount = Number(limit) || 20; // default 20 questions

    // 1️ Get all pages for this book
    const pages = await Page.find({ bookId }).sort({ pageNumber: 1 });

    if (!pages.length) {
      return res.status(404).json({ message: "No pages found for this book" });
    }

    // 2️ Concatenate text of all pages (you can later restrict to a range)
    const fullText = pages.map(p => p.text).join("\n");

    // 3️ Generate questions from the text
    const mcqs = generateMcqsFromText(fullText, maxCount);

    if (!mcqs.length) {
      return res.status(400).json({ message: "Not enough text to generate questions" });
    }

    // 4 Save them in DB
    const docsToSave = mcqs.map(q => ({
      bookId,
      pageNumbers: [], // optional: later you can store pages used
      questionText: q.questionText,
      options: q.options,
      correctIndex: q.correctIndex,
    }));

    const savedQuestions = await Question.insertMany(docsToSave);

    // 5️ Return created questions
    res.json({
      message: "Questions generated and saved",
      count: savedQuestions.length,
      questions: savedQuestions,
    });
  } catch (err) {
    console.error("Error generating questions:", err);
    res.status(500).json({ message: "Failed to generate questions" });
  }
});




app.use("/", loginAuth);
app.use("/admin", quizAdd);
app.use("/quiz", quiz);
app.use("/userResult", userResult);
app.use("/user", userResult); // adjust if results and user are different

// 5. Start server only once 
app.listen(PORT, async () => {
  try {
    await connect();  //  MongoDB connection happens here
    console.log("Connected to Database");
    console.log(` Server running at http://localhost:${PORT}`);
  } catch (err) {
    console.error("Database connection failed:", err);
  }
});
