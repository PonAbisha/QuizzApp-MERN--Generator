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
  useEffect(() => {
    if (!started) return;
    if (timeLeft <= 0) {
      if (!autoSubmitted.current) {
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
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, started]);

  /* ================ UI ================= */

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">

      {/* Exam Rules Modal */}
      {!started && (
        <ExamRulesModal onStart={() => setStarted(true)} />
      )}

      {started && (
        <div className="bg-white w-full max-w-3xl rounded-xl shadow p-6">

          {/* Progress + Timer */}
          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <span>
              Question {num + 1} / {questionArr.length}
            </span>
            <span className="font-semibold text-red-600">
              ⏱️ {Math.floor(timeLeft / 60)}:
              {String(timeLeft % 60).padStart(2, "0")}
            </span>
          </div>

          {/* Question */}
          <h2 className="text-xl font-tamil mb-6">
            {currentQuestion?.questions}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion?.options?.map((answer, index) => (
              <button
                key={index}
                onClick={() => {
                  const updated = [...ans];
                  updated[num] = answer.option;
                  setAns(updated);
                  setSelectedIndex(index);
                }}
                className={`w-full text-left p-3 rounded border 
                  ${
                    selectedIndex === index
                      ? "bg-blue-100 border-blue-700"
                      : "hover:bg-gray-100"
                  }`}
              >
                {answer.option}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-between mt-6">
            <button
              className="px-4 py-2 border rounded"
              onClick={() => {
                setNum(num + 1);
                setSelectedIndex(null);
              }}
            >
              Skip
            </button>

            {btnshow || num === questionArr.length - 1 ? (
              <Link to="/result">
                <button
                  className="bg-blue-800 text-white px-6 py-2 rounded"
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
                className="bg-blue-800 text-white px-6 py-2 rounded disabled:opacity-50"
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
  );
};
