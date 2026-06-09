// src/pages/BookList.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [generatingId, setGeneratingId] = useState(null);
  const [pendingGenerate, setPendingGenerate] = useState(null);
  const [generateDifficulty, setGenerateDifficulty] = useState("medium");
  const [generateCount, setGenerateCount] = useState(20);
  const [deletingId, setDeletingId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  useEffect(() => {
    loadBooks();
    // eslint-disable-next-line
  }, []);

  async function loadBooks() {
    setLoadingBooks(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/books`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks(res.data);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Failed to load textbooks from the database"
      );
    } finally {
      setLoadingBooks(false);
    }
  }

  function requestGenerate(book) {
    setPendingGenerate(book);
    setGenerateDifficulty("medium");
    setGenerateCount(20);
    setError("");
  }

  async function confirmGenerate() {
    if (!pendingGenerate) return;

    const bookId = pendingGenerate._id;
    setGeneratingId(bookId);
    setError("");

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_BASE}/generate-questions/${bookId}`,
        {
          limit: generateCount,
          difficulty: generateDifficulty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPendingGenerate(null);
      navigate(`/questions/${bookId}`);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to generate questions");
    } finally {
      setGeneratingId(null);
    }
  }

  function requestDelete(book) {
    setPendingDelete(book);
    setError("");
  }

  async function confirmDelete() {
    if (!pendingDelete) return;

    const bookId = pendingDelete._id;
    setDeletingId(bookId);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const authConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        await axios.delete(`${API_BASE}/books/${bookId}`, authConfig);
      } catch (deleteErr) {
        if (
          deleteErr?.response?.status !== 404 &&
          deleteErr?.response?.status !== 405
        ) {
          throw deleteErr;
        }

        await axios.post(`${API_BASE}/books/${bookId}/delete`, {}, authConfig);
      }

      setBooks((currentBooks) =>
        currentBooks.filter((book) => book._id !== bookId)
      );
      setPendingDelete(null);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to delete textbook");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-[80vh] bg-[#f6f7fb] px-4 py-8 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col justify-between gap-5 border-b border-slate-200 pb-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Study materials
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Textbook Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Manage uploaded books, review extracted pages, and generate
              focused practice questions for exam preparation.
            </p>
          </div>

          <button
            onClick={() => navigate("/upload")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Upload Book
          </button>
        </header>

        <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-500">Books</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-950">
              {books.length}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-500">Workflow</p>
            <p className="mt-1 text-sm font-bold text-teal-700">
              Upload -> Review -> Practice
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-500">Question Set</p>
            <p className="mt-1 text-sm font-bold text-blue-700">
              Choose count and difficulty
            </p>
          </div>
        </section>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            <svg
              className="h-5 w-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
              />
            </svg>
            {error}
          </div>
        )}

        {loadingBooks && (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <div className="h-10 w-10 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin"></div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Loading books
            </p>
          </div>
        )}

        {!loadingBooks && !books.length && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M12 6.25v13m0-13C10.83 5.48 9.25 5 7.5 5S4.17 5.48 3 6.25v13C4.17 18.48 5.75 18 7.5 18s3.33.48 4.5 1.25m0-13C13.17 5.48 14.75 5 16.5 5s3.33.48 4.5 1.25v13C19.83 18.48 18.25 18 16.5 18s-3.33.48-4.5 1.25"
                />
              </svg>
            </div>
            <h3 className="text-lg font-extrabold text-slate-950">
              No books uploaded yet
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Upload a PDF textbook to extract pages and build a practice test.
            </p>
          </div>
        )}

        {!loadingBooks && !!books.length && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <article
                key={book._id}
                className="flex min-h-[260px] flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <div>
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                            d="M12 6.25v13m0-13C10.83 5.48 9.25 5 7.5 5S4.17 5.48 3 6.25v13C4.17 18.48 5.75 18 7.5 18s3.33.48 4.5 1.25m0-13C13.17 5.48 14.75 5 16.5 5s3.33.48 4.5 1.25v13C19.83 18.48 18.25 18 16.5 18s-3.33.48-4.5 1.25"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <h2 className="truncate text-base font-extrabold text-slate-950">
                          {book.title}
                        </h2>
                        <p className="mt-1 text-xs font-mono uppercase text-slate-400">
                          ID #{book._id.slice(-6).toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      Uploaded{" "}
                      {new Date(book.createdAt).toLocaleDateString()}
                    </span>
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                      Ready for prep
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  <button
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    onClick={() => navigate(`/pages/${book._id}`)}
                  >
                    Pages
                  </button>

                  <button
                    className={`rounded-lg px-3 py-2.5 text-xs font-bold text-white transition ${
                      generatingId === book._id
                        ? "bg-slate-400"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    onClick={() => requestGenerate(book)}
                    disabled={generatingId === book._id}
                  >
                    {generatingId === book._id ? "Working" : "Generate"}
                  </button>

                  <button
                    className={`rounded-lg border px-3 py-2.5 text-xs font-bold transition ${
                      deletingId === book._id
                        ? "border-red-200 bg-red-50 text-red-500"
                        : "border-red-200 bg-white text-red-600 hover:bg-red-50"
                    }`}
                    onClick={() => requestDelete(book)}
                    disabled={deletingId === book._id || generatingId === book._id}
                  >
                    {deletingId === book._id ? "Deleting" : "Delete"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {pendingDelete && (
        <ConfirmModal
          tone="danger"
          title="Delete textbook?"
          body="Are you sure you want to delete this book and all questions generated from it?"
          itemTitle={pendingDelete.title}
          confirmLabel={deletingId === pendingDelete._id ? "Deleting..." : "Delete"}
          disabled={deletingId === pendingDelete._id}
          onCancel={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
        />
      )}

      {pendingGenerate && (
        <GenerateModal
          book={pendingGenerate}
          difficulty={generateDifficulty}
          questionCount={generateCount}
          disabled={generatingId === pendingGenerate._id}
          confirmLabel={
            generatingId === pendingGenerate._id ? "Generating..." : "Generate"
          }
          onDifficultyChange={setGenerateDifficulty}
          onQuestionCountChange={setGenerateCount}
          onCancel={() => setPendingGenerate(null)}
          onConfirm={confirmGenerate}
        />
      )}
    </div>
  );
}

function GenerateModal({
  book,
  difficulty,
  questionCount,
  disabled,
  confirmLabel,
  onDifficultyChange,
  onQuestionCountChange,
  onCancel,
  onConfirm,
}) {
  const counts = [5, 10, 20, 30, 50];
  const difficultyOptions = [
    {
      value: "easy",
      label: "Easy",
      description: "Shorter questions",
    },
    {
      value: "medium",
      label: "Medium",
      description: "Balanced practice",
    },
    {
      value: "hard",
      label: "Hard",
      description: "Longer source lines",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14.75 11.17 11.55 9.13A1 1 0 0 0 10 10v4a1 1 0 0 0 1.55.83l3.2-2.04a1 1 0 0 0 0-1.66z"
              />
            </svg>
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-extrabold text-slate-950">
              Generate practice test
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Choose the difficulty and number of questions for this textbook.
            </p>
            <p className="mt-3 break-words text-xs font-bold text-slate-800">
              {book.title}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Difficulty
            </label>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {difficultyOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onDifficultyChange(option.value)}
                  disabled={disabled}
                  className={`rounded-lg border px-3 py-3 text-left transition ${
                    difficulty === option.value
                      ? "border-blue-500 bg-blue-50 text-blue-800"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="block text-sm font-extrabold">
                    {option.label}
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    {option.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Number of questions
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {counts.map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => onQuestionCountChange(count)}
                  disabled={disabled}
                  className={`h-10 min-w-12 rounded-lg border px-3 text-sm font-extrabold transition ${
                    questionCount === count
                      ? "border-blue-500 bg-blue-600 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
            onClick={onCancel}
            disabled={disabled}
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            onClick={onConfirm}
            disabled={disabled}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({
  tone,
  title,
  body,
  itemTitle,
  confirmLabel,
  disabled,
  onCancel,
  onConfirm,
}) {
  const isDanger = tone === "danger";
  const accentClass = isDanger
    ? "bg-red-50 text-red-600 border-red-100"
    : "bg-blue-50 text-blue-600 border-blue-100";
  const buttonClass = isDanger
    ? "bg-red-600 hover:bg-red-700"
    : "bg-blue-600 hover:bg-blue-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border ${accentClass}`}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isDanger
                    ? "M12 9v4m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
                    : "M14.75 11.17 11.55 9.13A1 1 0 0 0 10 10v4a1 1 0 0 0 1.55.83l3.2-2.04a1 1 0 0 0 0-1.66z"
                }
              />
            </svg>
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-extrabold text-slate-950">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
            <p className="mt-3 break-words text-xs font-bold text-slate-800">
              {itemTitle}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
            onClick={onCancel}
            disabled={disabled}
          >
            Cancel
          </button>
          <button
            className={`rounded-lg px-4 py-2.5 text-xs font-bold text-white transition disabled:cursor-not-allowed disabled:bg-slate-400 ${buttonClass}`}
            onClick={onConfirm}
            disabled={disabled}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
