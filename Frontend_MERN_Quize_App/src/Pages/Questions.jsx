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
      const res = await axios.get(`${API_BASE}/questions/${bookId}`);
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
      alert("No questions found. Generate questions first.");
      return;
    }
    setPlaying(true);
  }

  function handleBack() {
    navigate("/");
  }

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={handleBack} style={{ padding: "6px 10px" }}>
          ← Back
        </button>
        <h2>Questions for Book {bookId?.slice(-6)}</h2>
      </header>

      {loading && <p>Loading questions…</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!playing && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
            <div>Total questions: {questions.length}</div>
            <div>
              <button onClick={loadQuestions} style={{ marginRight: 8 }}>Refresh</button>
              <button onClick={handlePlay} disabled={!questions.length}>Play Quiz</button>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            {questions.map((q, idx) => (
              <div key={q._id || idx} style={{ padding: 12, border: "1px solid #eee", marginBottom: 8 }}>
                <div><strong>Q{idx + 1}.</strong></div>
                <div style={{ margin: "8px 0" }}>{q.questionText}</div>
                <ol type="A">
                  {q.options.map((opt, i) => (
                    <li key={i} style={{ marginBottom: 6 }}>{opt}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </>
      )}

      {playing && (
        <QuizPlayer
          questions={questions}
          onFinish={() => setPlaying(false)}
        />
      )}
    </div>
  );
}
