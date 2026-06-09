import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export const Resultshow = () => {
  const [count, setCount] = useState(0);
  const [feedback, setFeedback] = useState("");

  const UserName = useSelector((state) => state.mernQuize.userName);
  const resultUser = useSelector((state) => state.mernQuize.result);
  const singleQuiz = useSelector((state) => state?.mernQuize.QuizData);
  
  // Memoize questionArr to prevent unnecessary useEffect triggers due to new array instances
  const questionArr = useMemo(() => singleQuiz[0]?.questionArray || [], [singleQuiz]);

  useEffect(() => {
    let correct = 0;

    questionArr.forEach((q, index) => {
      if (q.correctAnswer === resultUser[index]) {
        correct++;
      }
    });

    setCount(correct);

    const percentage = Math.round((correct / questionArr.length) * 100);

    if (percentage >= 90) {
      setFeedback(`🎉 Excellent! You cleared the test, ${UserName}`);
    } else if (percentage >= 50) {
      setFeedback(`👍 Good job! Keep practicing, ${UserName}`);
    } else {
      setFeedback(`❌ Don't worry ${UserName}, practice more and retry`);
    }
  }, [questionArr, resultUser, UserName]);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow p-6">

        <h1 className="text-2xl font-bold text-blue-900 mb-6">
          Result Analysis
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <Stat title="Score" value={`${count}/${questionArr.length}`} />
          <Stat
            title="Accuracy"
            value={`${Math.round((count / questionArr.length) * 100)}%`}
          />
          <Stat title="Status" value={count >= questionArr.length / 2 ? "Pass" : "Fail"} />
        </div>

        {/* Feedback */}
        <div className="bg-blue-50 p-4 rounded mb-6">
          <p className="font-semibold text-blue-900">{feedback}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <Link to="/">
            <button className="border px-4 py-2 rounded">
              Attempt More Quiz
            </button>
          </Link>

          <Link to="/showallanswer">
            <button className="bg-blue-900 text-white px-4 py-2 rounded">
              View Answers
            </button>
          </Link>
        </div>

      </div>
      <ToastContainer theme="light" position="bottom-right" />
    </div>
  );
};

function Stat({ title, value }) {
  return (
    <div className="bg-gray-50 p-4 rounded">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
