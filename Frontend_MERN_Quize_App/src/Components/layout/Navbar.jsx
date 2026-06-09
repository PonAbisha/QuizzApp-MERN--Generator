import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Logouthandleraction } from "../../Redux/action";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userName = useSelector((state) => state.mernQuize?.userName);
  const adminName = useSelector((state) => state.mernQuize?.adminName);
  const token = localStorage.getItem("token");

  const displayName = adminName || userName || "Learner";
  const isLoggedIn = !!token;

  const handleLogout = () => {
    dispatch(Logouthandleraction());
    // Clear Redux user state
    dispatch({ type: "LOGOUTUSER" });
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition-colors duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-6 h-6"
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
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight text-slate-950 group-hover:text-blue-700 transition-colors">
              AI Quizzer
            </span>
            <span className="text-[10px] font-medium text-slate-500 -mt-1 tracking-wider uppercase">
              MERN Platform
            </span>
          </div>
        </Link>

        {/* Navigation Actions */}
        {isLoggedIn && (
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" active={isActive("/")}>Home</NavLink>
            <NavLink to="/upload" active={isActive("/upload")}>Upload PDF</NavLink>
            {adminName && (
              <NavLink to="/admin" active={isActive("/admin")}>Admin Hub</NavLink>
            )}
          </nav>
        )}

        {/* User Info & Actions */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              {/* Profile Avatar Badge */}
              <Link to="/profile" className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-slate-50 border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-all duration-300">
                <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
                  {displayName}
                </span>
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white uppercase shadow-sm">
                  {displayName[0]}
                </div>
              </Link>
              
              {/* Logout Trigger */}
              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-red-50 border border-red-200 text-xs font-bold text-red-600 transition-all duration-300 cursor-pointer"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-700 hover:text-blue-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-sm transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

function NavLink({ to, children, active }) {
  return (
    <Link
      to={to}
      className={`relative px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 ${
        active 
          ? "text-blue-700 bg-blue-50 border border-blue-100" 
          : "text-slate-600 hover:text-blue-700 hover:bg-slate-50"
      }`}
    >
      {children}
    </Link>
  );
}
