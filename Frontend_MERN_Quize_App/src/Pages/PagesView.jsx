// src/Pages/PagesView.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function PagesView() {
  const { bookId } = useParams();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";
  const navigate = useNavigate();

  useEffect(() => {
    if (bookId) loadPages();
    // eslint-disable-next-line
  }, [bookId]);

  async function loadPages() {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/pages/${bookId}`);
      setPages(res.data || []);
    } catch (err) {
      console.error("Failed to load pages:", err);
      setPages([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>
        ← Back
      </button>

      <h2>Pages for Book {bookId?.slice?.(-6)}</h2>

      {loading && <p>Loading pages…</p>}
      {!loading && !pages.length && <p>No pages found.</p>}

      <div>
        {pages.map((p) => (
          <div key={p._id} style={{ padding: 12, borderBottom: "1px solid #eee" }}>
            <div style={{ fontWeight: 600 }}>Page {p.pageNumber}</div>
            <pre style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{p.text?.slice(0, 800) || ""}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
