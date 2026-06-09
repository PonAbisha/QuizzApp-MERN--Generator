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
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/pages/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPages(res.data || []);
    } catch (err) {
      console.error("Failed to load pages:", err);
      setPages([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[85vh] bg-neutral-100 text-neutral-950 px-4 sm:px-6 py-8">
      {/* Header & Back Button */}
      <header className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-neutral-300 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-lg bg-white border border-neutral-300 flex items-center justify-center text-neutral-700 hover:text-neutral-950 hover:border-neutral-500 transition-all cursor-pointer shadow-sm"
            title="Go Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-2xl font-extrabold text-neutral-950 tracking-tight">
              Uploaded Pages
            </h2>
            <p className="text-xs text-neutral-500 font-mono mt-0.5 uppercase">
              Material ID: #{bookId?.slice?.(-6).toUpperCase()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700 bg-white px-4 py-2 rounded-lg border border-neutral-300 shadow-sm">
          <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Total Pages: {pages.length}
        </div>
      </header>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-neutral-300 border-t-neutral-900 animate-spin"></div>
          <p className="text-xs font-semibold text-neutral-500 tracking-wider uppercase">Loading pages...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !pages.length && (
        <div className="max-w-xl mx-auto text-center py-20 rounded-xl border border-neutral-300 bg-white p-8 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-950">No text pages extracted</h3>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto mt-1 leading-relaxed">
            This textbook might still be processing. Please return to the dashboard.
          </p>
        </div>
      )}

      {/* Pages Container */}
      {!loading && !!pages.length && (
        <div className="max-w-5xl mx-auto space-y-8">
          {pages.map((p, idx) => (
            <div
              key={p._id}
              className="mx-auto w-full max-w-[850px] min-h-[900px] bg-white border border-neutral-300 shadow-[0_8px_30px_rgba(0,0,0,0.12)] px-7 py-8 sm:px-14 sm:py-12"
            >
              {/* Page Header */}
              <div className="flex justify-between items-center mb-8 text-xs text-neutral-500 border-b border-neutral-200 pb-3">
                <span>Page {idx + 1}</span>
                <span>Original page {p.pageNumber}</span>
              </div>

              {/* Page Content */}
              <pre className="font-serif text-[15px] sm:text-base text-neutral-950 leading-7 whitespace-pre-wrap break-words select-text">
                {p.text || "No text content available for this page."}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

