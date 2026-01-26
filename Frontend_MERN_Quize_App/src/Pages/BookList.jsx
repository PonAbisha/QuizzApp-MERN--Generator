// src/pages/BookList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [generatingId, setGeneratingId] = useState(null);
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
      const res = await axios.get(`${API_BASE}/books`);
      setBooks(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load books");
    } finally {
      setLoadingBooks(false);
    }
  }

  async function handleGenerate(bookId) {
    if (!window.confirm("Generate questions for this book?")) return;

    setGeneratingId(bookId);
    setError("");
    try {
      const res = await axios.post(`${API_BASE}/generate-questions/${bookId}`, {
        limit: 20, // change number of questions if you want
      });

      // navigate to questions page (assumes /questions/:bookId route exists)
      navigate(`/questions/${bookId}`);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message || "Failed to generate questions";
      setError(msg);
    } finally {
      setGeneratingId(null);
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>Uploaded Books</h1>

      {loadingBooks && <p>Loading books…</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loadingBooks && !books.length && <p>No books uploaded yet.</p>}

      <div style={styles.grid}>
        {books.map((b) => (
          <div key={b._id} style={styles.card}>
            <div style={styles.cardHeader}>
              <strong style={{ fontSize: 16 }}>{b.title}</strong>
              <span style={styles.small}>#{b._id.slice(-6)}</span>
            </div>

            <div style={styles.meta}>
              <div>Uploaded: {new Date(b.createdAt).toLocaleString()}</div>
              {b.filePath && <div>Path: {b.filePath.split("/").pop()}</div>}
            </div>

            <div style={styles.actions}>
              <button
                style={styles.btn}
                onClick={() => navigate(`/pages/${b._id}`)}
              >
                View Pages
              </button>

              <button
                style={{
                  ...styles.btn,
                  ...(generatingId === b._id ? styles.btnDisabled : {}),
                }}
                onClick={() => handleGenerate(b._id)}
                disabled={generatingId === b._id}
              >
                {generatingId === b._id ? "Generating…" : "Generate Questions"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: 20, maxWidth: 1000, margin: "0 auto" },
  h1: { marginBottom: 16 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 12,
  },
  card: {
    border: "1px solid #e0e0e0",
    borderRadius: 8,
    padding: 12,
    background: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: 140,
  },
  cardHeader: { display: "flex", justifyContent: "space-between", gap: 8 },
  meta: { marginTop: 8, color: "#666", fontSize: 13 },
  actions: { marginTop: 12, display: "flex", gap: 8 },
  btn: {
    padding: "8px 12px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    background: "#1976d2",
    color: "#fff",
  },
  btnDisabled: { opacity: 0.6, cursor: "wait" },
  small: { color: "#999", fontSize: 12 },
  error: { color: "crimson" },
};
