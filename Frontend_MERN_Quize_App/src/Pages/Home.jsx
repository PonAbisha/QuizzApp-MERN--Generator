export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-blue-900 mb-2">
        Quiz Generator
      </h1>
      <p className="text-gray-600 mb-6">
        Upload Books and generate exam-level quizzes automatically
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-lg">📘 Upload Book</h2>
          <p className="text-sm text-gray-500 mt-2">
            Upload  books
          </p>
          <button className="mt-4 bg-blue-800 text-white px-4 py-2 rounded">
            Upload PDF
          </button>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-lg">📝 Generate Quiz</h2>
          <p className="text-sm text-gray-500 mt-2">
            Topic-wise & chapter-wise MCQs
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold text-lg">📊 Track Progress</h2>
          <p className="text-sm text-gray-500 mt-2">
            Accuracy, weak areas, scores
          </p>
        </div>
      </div>
    </div>
  );
}
