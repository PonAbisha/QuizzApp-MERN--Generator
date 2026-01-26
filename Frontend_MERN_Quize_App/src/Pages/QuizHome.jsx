import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const QuizHome = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/books");
        setBooks(res.data);
      } catch (err) {
        setError("Failed to load books");
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Select a Book to Start Quiz
      </h1>

      {error && <p className="text-red-500">{error}</p>}

      {books.length === 0 ? (
        <p>No books uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="border rounded p-4 shadow-sm bg-white"
            >
              <h2 className="font-medium">{book.title}</h2>
              <p className="text-sm text-gray-500">
                Pages: {book.totalPages}
              </p>

              <Link to={`/questions/${book._id}`}>
                <button className="mt-4 bg-blue-700 text-white px-4 py-2 rounded">
                  Start Quiz
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizHome;
