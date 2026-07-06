import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  GETUSERID,
  GETUSERNAME,
  GETADMINID,
  GETADMINNAME,
} from "../../Redux/actiontype";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_BASE || "https://quizzapp-backend-abisha.onrender.com";

  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const login = async (e) => {
    e.preventDefault();
    if (!user.email || !user.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/login`, user);
      const { token, user: loggedUser } = res.data;

      localStorage.setItem("token", token);

      if (loggedUser.email === "sudhirchavhan100@gmail.com") {
        dispatch({ type: GETADMINID, payload: loggedUser.id });
        dispatch({ type: GETADMINNAME, payload: loggedUser.name });
        toast.success(`Welcome Admin ${loggedUser.name}`);
      } else {
        dispatch({ type: GETUSERID, payload: loggedUser.id });
        dispatch({ type: GETUSERNAME, payload: loggedUser.name });
        toast.success("Login successful! Welcome back.");
      }

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-[#f6f7fb]">

      <div className="max-w-5xl w-full flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-white">
        
        {/* Visual Illustration Pane (Hidden on small screens) */}
        <div className="hidden md:flex md:w-1/2 bg-blue-50 p-12 items-center justify-center border-r border-slate-200 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white/50 pointer-events-none"></div>
          <div className="w-full text-center space-y-6 animate-float">
            <img
              src="./login.gif"
              alt="Secure Login Illustration"
              className="w-4/5 mx-auto rounded-2xl shadow-lg border border-blue-100"
            />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-950">Unlock Your Full Potential</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Generate high-quality practice questions from your books and prepare seamlessly for TNPSC examinations.
              </p>
            </div>
          </div>
        </div>

        {/* Login Form Pane */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-8">
            
            {/* Header */}
            <div>
              <img src="./quiz1.gif" alt="AI Quizzer Logo" className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Welcome Back
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Sign in to continue your preparation journey.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={login} className="space-y-5">
              
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
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
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:border-blue-500 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all text-sm"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
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
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:border-blue-500 focus:bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 transition-all text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                ) : (
                  "Sign In"
                )}
              </button>

            </form>

            {/* Footer Navigation */}
            <div className="text-center pt-2">
              <p className="text-sm text-slate-600">
                New user?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Create an account
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>

      <ToastContainer theme="light" position="bottom-right" />
    </div>
  );
};
