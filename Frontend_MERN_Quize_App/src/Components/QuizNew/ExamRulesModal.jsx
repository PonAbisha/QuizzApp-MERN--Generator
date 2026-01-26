export default function ExamRulesModal({ onStart }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white max-w-lg w-full rounded-xl p-6">
        <h2 className="text-xl font-bold text-blue-900 mb-4">
          TNPSC Exam Instructions
        </h2>

        <ul className="list-disc ml-5 text-gray-700 space-y-2">
          <li>Each question carries 1 mark</li>
          <li>No negative marking</li>
          <li>Do not refresh the page</li>
          <li>Quiz auto-submits when time ends</li>
        </ul>

        <button
          onClick={onStart}
          className="mt-6 bg-blue-900 text-white px-6 py-2 rounded"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}
