import React from "react";

export const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200 bg-white px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center text-blue-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 4h12l2 2v14a1 1 0 01-1 1H6a1 1 0 01-1-1V5a1 1 0 011-1z" />
              <path d="M14 4v4h4" />
              <path d="M9 11l2 2 4-4" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-slate-700">
            AI Quizzer
          </span>
        </div>

        <p className="text-[11px] text-slate-500 text-center sm:text-right">
          © {new Date().getFullYear()} AI Quiz Generator
        </p>
      </div>
    </footer>
  );
};
