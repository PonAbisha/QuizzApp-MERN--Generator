import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-[#1e3a8a] text-white mt-16">

      {/* Bottom line */}
      <div className="border-t border-blue-400 text-center py-3 text-xs text-gray-300">
        © {new Date().getFullYear()} TNPSC Quiz Generator | Built with MERN
      </div>
    </footer>
  );
};


