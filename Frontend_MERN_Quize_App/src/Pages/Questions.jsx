// src/Pages/Questions.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import QuizPlayer from "../Components/QuizPlayer";

export default function Questions() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadQuestions();
    // eslint-disable-next-line
  }, [bookId]);

  async function loadQuestions() {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/questions/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuestions(res.data || []);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Failed to fetch questions. Try generating first."
      );
    } finally {
      setLoading(false);
    }
  }

  function handlePlay() {
    if (!questions.length) {
      setError("No questions found. Generate questions first.");
      return;
    }

    setPlaying(true);
  }

  return (
    <div className="min-h-[85vh] bg-[#f6f7fb] px-4 py-8 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col justify-between gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end">
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate("/")}
              className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-950"
              title="Go to Book List"
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
                  strokeWidth="2.5"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Practice test
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
                AI Practice Set
              </h2>
              <p className="mt-1 text-xs font-mono uppercase text-slate-400">
                Book Reference ID: #{bookId?.slice(-6).toUpperCase()}
              </p>
            </div>
          </div>

          {!playing && !!questions.length && (
            <div className="flex items-center gap-3">
              <button
                onClick={loadQuestions}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-950"
                title="Refresh Questions"
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
                    strokeWidth="2"
                    d="M4 4v5h.58m15.36 2A8 8 0 1 1 21.21 15.89M9.88 9.88 6.59 6.59m0 0 3.29-3.29M6.59 6.59v7.5"
                  />
                </svg>
              </button>

              <button
                onClick={handlePlay}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
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
                    d="M14.75 11.17 11.55 9.13A1 1 0 0 0 10 10v4a1 1 0 0 0 1.55.83l3.2-2.04a1 1 0 0 0 0-1.66z"
                  />
                </svg>
                Start Quiz
              </button>
            </div>
          )}
        </header>

        {loading && (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <div className="h-10 w-10 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin"></div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Fetching questions
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {!playing && !loading && (
          <div className="space-y-5">
            <div className="flex flex-col justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Question Preview
              </span>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  {questions.length} questions
                </span>
                {!!questions[0]?.difficulty && (
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold capitalize text-teal-700">
                    {questions[0].difficulty}
                  </span>
                )}
              </div>
            </div>

            {!questions.length && !error && (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                <p className="text-sm text-slate-600">
                  No questions found for this book yet.
                </p>
                <button
                  onClick={loadQuestions}
                  className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
                >
                  Fetch Again
                </button>
              </div>
            )}

            <div className="space-y-4">
              {questions.map((question, idx) => (
                <article
                  key={question._id || idx}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-extrabold text-blue-700">
                      {idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-bold leading-7 text-slate-950">
                        {question.questionText}
                      </p>
                      <ol className="mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                        {question.options.map((option, optionIndex) => (
                          <li
                            key={optionIndex}
                            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-700"
                          >
                            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-white text-[10px] font-extrabold text-blue-700">
                              {String.fromCharCode(65 + optionIndex)}
                            </span>
                            <span className="truncate">{option}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {playing && (
          <QuizPlayer questions={questions} onFinish={() => setPlaying(false)} />
        )}
      </div>
    </div>
  );
}
