import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    reEnterPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  const register = async (e) => {
    e.preventDefault();
    const { name, email, password, reEnterPassword } = user;

    if (!name || !email || !password || !reEnterPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== reEnterPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_BASE}/register`, user);
      toast.success("Successfully Registered! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      // Fallback to secondary production url if local fails during register
      try {
        await axios.post("https://mern-quiz-server-sudhir.onrender.com/register", user);
        toast.success("Successfully Registered! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2500);
      } catch (err2) {
        toast.error(err.response?.data?.message || "Registration failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-[#f6f7fb]">

      <div className="max-w-5xl w-full flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-white">
        
        {/* Register Form Pane */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white order-2 md:order-1">
          <div className="max-w-md w-full mx-auto space-y-8">
            
            {/* Header */}
            <div>
              <img src="./quiz1.gif" alt="AI Quizzer Logo" className="h-12 w-12 mx-auto mb-4" />

              <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Create Account
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Join the platform and take your first step.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={register} className="space-y-4">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Your Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="name"
                    required
                    value={user.name}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-blue-500 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all text-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    value={user.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-blue-500 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all text-sm"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type="password"
                    name="password"
                    required
                    value={user.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-blue-500 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Re-enter Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </span>
                  <input
                    type="password"
                    name="reEnterPassword"
                    required
                    value={user.reEnterPassword}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 border focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all text-sm ${
                      user.reEnterPassword && user.password === user.reEnterPassword
                        ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/25"
                        : user.reEnterPassword
                        ? "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/25"
                        : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/25"
                    }`}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                ) : (
                  "Create Account"
                )}
              </button>

            </form>

            {/* Footer Navigation */}
            <div className="text-center pt-1">
              <p className="text-sm text-slate-600">
                Already registered?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>

          </div>
        </div>

        {/* Visual Illustration Pane (Hidden on small screens) */}
        <div className="hidden md:flex md:w-1/2 bg-blue-50 p-12 items-center justify-center border-l border-slate-200 relative order-1 md:order-2">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white/50 pointer-events-none"></div>
          <div className="w-full text-center space-y-6 animate-float">
            <img
              src="./register.gif"
              alt="Secure Register Illustration"
              className="w-4/5 mx-auto rounded-2xl shadow-lg border border-blue-100"
            />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-950">Join a Smart Academy</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Unlock instant AI evaluation of uploaded textbooks, detailed answer keys, and dynamic progress trackers.
              </p>
            </div>
          </div>
        </div>

      </div>

      <ToastContainer theme="dark" position="bottom-right" />
    </div>
  );
};
