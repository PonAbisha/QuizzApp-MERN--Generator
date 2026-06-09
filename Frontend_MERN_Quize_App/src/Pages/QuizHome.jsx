import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const QuizHome = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`${API_BASE}/books`);
        setBooks(res.data);
      } catch (err) {
        setError("Failed to load books");
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f7fb] px-4 py-10 text-slate-900 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
          <h1 className="text-3xl font-semibold text-slate-950 mb-3">
            Select a Book to Start Quiz
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            Choose any uploaded textbook and begin a smart quiz practice session.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {books.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">No books uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {books.map((book) => (
              <div
                key={book._id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <h2 className="text-lg font-semibold text-slate-950">{book.title}</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Pages: {book.totalPages}
                </p>

                <Link to={`/questions/${book._id}`}>
                  <button className="mt-6 inline-flex items-center justify-center rounded-2xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800">
                    Start Quiz
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizHome;
