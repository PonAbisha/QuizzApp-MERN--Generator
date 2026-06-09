import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postQuizResult, postUserResult } from "../../Redux/action.js";
import { Link, useNavigate } from "react-router-dom";
import ExamRulesModal from "./ExamRulesModal";

const TOTAL_TIME = 10 * 60; // 10 minutes

export const Quiz = ({ questionArr }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const data = useSelector((state) => state?.mernQuize?.QuizData);
  const userID = useSelector((state) => state?.mernQuize?.userId);
  const quizID = data?.[0]?._id;

  const [num, setNum] = useState(0);
  const [ans, setAns] = useState([]);
  const [btnshow, setBtnshow] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [started, setStarted] = useState(false);

  const autoSubmitted = useRef(false);

  const currentQuestion = questionArr[num];

  /* ================= TIMER ================= */
  // Effect 1: Handles the countdown interval
  useEffect(() => {
    if (!started || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, timeLeft]);

  // Effect 2: Handles auto-submission when time runs out
  useEffect(() => {
    if (started && timeLeft <= 0 && !autoSubmitted.current) {
      autoSubmitted.current = true;

      dispatch(postUserResult(ans));
      dispatch(
        postQuizResult({
          quizId: quizID,
          userId: userID,
          quizResult: ans,
        })
      );

      navigate("/result");
    }
  }, [started, timeLeft, ans, dispatch, navigate, quizID, userID]);

  /* ================ UI ================= */

  return (
    <div className="min-h-screen bg-[#f6f7fb] px-4 py-8 text-slate-900 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">

        {/* Exam Rules Modal */}
        {!started && <ExamRulesModal onStart={() => setStarted(true)} />}

        {started && (
          <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">

            {/* Progress + Timer */}
            <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-700 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm font-semibold text-slate-700">
                Question {num + 1} / {questionArr.length}
              </span>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                ⏱️ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
              </span>
            </div>

            {/* Question */}
            <h2 className="text-2xl font-semibold leading-tight text-slate-950 mb-6">
              {currentQuestion?.questionText || currentQuestion?.questions}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion?.options?.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const updated = [...ans];
                    updated[num] = typeof answer === 'object' ? answer.option : answer;
                    setAns(updated);
                    setSelectedIndex(index);
                  }}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                    selectedIndex === index
                      ? "bg-blue-50 border-blue-300 text-slate-900"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {typeof answer === 'object' ? answer.option : answer}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                onClick={() => {
                  setNum(num + 1);
                  setSelectedIndex(null);
                }}
              >
                Skip
              </button>

              {btnshow || num === questionArr.length - 1 ? (
                <Link to="/result" className="w-full sm:w-auto">
                  <button
                    className="w-full rounded-2xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 sm:w-auto"
                    onClick={() => {
                      dispatch(postUserResult(ans));
                      dispatch(
                        postQuizResult({
                          quizId: quizID,
                          userId: userID,
                          quizResult: ans,
                        })
                      );
                    }}
                  >
                    Submit
                  </button>
                </Link>
              ) : (
                <button
                  disabled={selectedIndex === null}
                  className="w-full rounded-2xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-blue-800 sm:w-auto"
                  onClick={() => {
                    setNum(num + 1);
                    setSelectedIndex(null);
                    if (questionArr.length - 2 === num) {
                      setBtnshow(true);
                    }
                  }}
                >
                  Next
                </button>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
