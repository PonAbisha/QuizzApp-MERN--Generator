import React, { useState } from "react";

export default function QuizPlayer({ questions = [], onFinish }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  if (!questions.length) return <div>No questions available.</div>;

  const q = questions[index];

  function handleSelect(i) {
    setSelected(i);
  }

  function handleNext() {
    if (selected === null) {
      alert("Please select an answer");
      return;
    }

    setAnswers(prev => [
      ...prev,
      { qIndex: index, selectedIndex: selected, correctIndex: q.correctIndex }
    ]);

    setSelected(null);

    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      setFinished(true);
    }
  }

  function handleFinish() {
    setFinished(false);
    if (onFinish) onFinish();
  }

  if (finished) {
    const correct = answers.filter(a => a.selectedIndex === a.correctIndex).length;
    const total = answers.length;
    const percent = Math.round((correct / total) * 100);

    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h2>Quiz Completed!</h2>
        <p>Your Score: {correct} / {total} ({percent}%)</p>
        <button onClick={handleFinish}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h3>Question {index + 1} / {questions.length}</h3>

      <p style={{ fontSize: "18px", marginBottom: "12px" }}>
        {q.questionText}
      </p>

      <div>
        {q.options.map((opt, i) => (
          <label
            key={i}
            style={{ display: "block", marginBottom: "10px", cursor: "pointer" }}
          >
            <input
              type="radio"
              checked={selected === i}
              onChange={() => handleSelect(i)}
            />
            {" "}
            {opt}
          </label>
        ))}
      </div>

      <button onClick={handleNext} style={{ marginTop: "15px" }}>
        {index + 1 === questions.length ? "Finish" : "Next"}
      </button>
    </div>
  );
}
