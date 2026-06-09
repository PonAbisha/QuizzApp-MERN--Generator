import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UploadBook = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function acceptFile(selectedFile) {
    if (selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setMessage("");
    } else {
      setMessage("Only PDF files are supported.");
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      acceptFile(e.dataTransfer.files[0]);
    }
  }

  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      acceptFile(e.target.files[0]);
    }
  }

  async function handleUpload() {
    if (!file) {
      setMessage("Please select a PDF textbook first.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", file);

      await axios.post(`${API_BASE}/upload/file`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Book uploaded successfully.");
      setFile(null);

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[75vh] bg-[#f6f7fb] px-4 py-10 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <header className="mb-7 border-b border-slate-200 pb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Upload material
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Add a PDF Textbook
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Upload a PDF book or paper. The app will extract readable pages so
            you can review the material and generate a practice test.
          </p>
        </header>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            className={`flex min-h-[280px] cursor-pointer flex-col items-center justify-center gap-5 rounded-lg border-2 border-dashed p-8 text-center transition ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : file
                ? "border-teal-400 bg-teal-50"
                : "border-slate-300 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            <div
              className={`flex h-16 w-16 items-center justify-center rounded-lg border ${
                file
                  ? "border-teal-100 bg-white text-teal-700"
                  : "border-blue-100 bg-white text-blue-600"
              }`}
            >
              {file ? (
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M7 16a4 4 0 0 1-.88-7.9A5 5 0 0 1 15.9 6H16a5 5 0 0 1 1 9.9M15 13l-3-3m0 0-3 3m3-3v12"
                  />
                </svg>
              )}
            </div>

            {file ? (
              <div>
                <p className="mx-auto max-w-sm truncate text-base font-extrabold text-slate-950">
                  {file.name}
                </p>
                <p className="mt-1 text-xs font-mono uppercase text-slate-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB · PDF
                </p>
              </div>
            ) : (
              <div>
                <p className="text-base font-extrabold text-slate-950">
                  Drag and drop your PDF here
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  or click to browse your local files
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? (
                <span className="h-5 w-5 rounded-full border-2 border-white/40 border-t-white animate-spin"></span>
              ) : (
                "Upload and Extract Pages"
              )}
            </button>

            <button
              onClick={() => navigate("/")}
              className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Back
            </button>
          </div>

          {message && (
            <div
              className={`mt-5 rounded-lg border p-4 text-sm font-semibold ${
                message.toLowerCase().includes("success")
                  ? "border-teal-200 bg-teal-50 text-teal-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default UploadBook;
