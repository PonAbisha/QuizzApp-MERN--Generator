import React, { useMemo, useState } from "react";

export default function QuizPlayer({ questions = [], onFinish }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [notice, setNotice] = useState("");

  const progress = useMemo(() => {
    if (!questions.length) return 0;
    return Math.round(((index + 1) / questions.length) * 100);
  }, [index, questions.length]);

  if (!questions.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
        No questions available.
      </div>
    );
  }

  const q = questions[index];

  function handleSelect(optionIndex) {
    setSelected(optionIndex);
    setNotice("");
  }

  function handleNext() {
    if (selected === null) {
      setNotice("Please select an answer before moving ahead.");
      return;
    }

    setAnswers((prev) => [
      ...prev,
      {
        qIndex: index,
        selectedIndex: selected,
        correctIndex: q.correctIndex,
      },
    ]);

    setSelected(null);
    setNotice("");

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
    const correct = answers.filter(
      (answer) => answer.selectedIndex === answer.correctIndex
    ).length;
    const total = answers.length;
    const percent = Math.round((correct / total) * 100);

    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-2xl font-extrabold text-teal-700">
          {percent}%
        </div>
        <h2 className="text-2xl font-extrabold text-slate-950">
          Practice Completed
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          You scored {correct} out of {total}.
        </p>
        <button
          onClick={handleFinish}
          className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          Back to Questions
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-wider text-slate-500">
          <span>
            Question {index + 1} of {questions.length}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-teal-500 transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <p className="text-lg font-bold leading-8 text-slate-950">
        {q.questionText}
      </p>

      <div className="mt-6 grid gap-3">
        {q.options.map((opt, optionIndex) => {
          const isSelected = selected === optionIndex;

          return (
            <button
              key={optionIndex}
              onClick={() => handleSelect(optionIndex)}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition ${
                isSelected
                  ? "border-blue-500 bg-blue-50 text-blue-800"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-slate-50"
              }`}
            >
              <span
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-xs font-extrabold ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {String.fromCharCode(65 + optionIndex)}
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {notice && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          {notice}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleNext}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          {index + 1 === questions.length ? "Finish Test" : "Next Question"}
        </button>
      </div>
    </div>
  );
}
