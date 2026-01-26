import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  loginAdminId,
  loginAdminName,
  loginUser,
  loginUserName,
} from "../../Redux/action";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", user);

      const { token, user: loggedUser } = res.data;

      // ✅ STORE TOKEN (THIS IS THE KEY)
      localStorage.setItem("token", token);

      // Optional Redux usage (fine to keep)
      if (loggedUser.email === "sudhirchavhan100@gmail.com") {
        dispatch(loginAdminId(loggedUser._id));
        dispatch(loginAdminName(loggedUser.name));
        toast.success(`Welcome Admin ${loggedUser.name}`);
      } else {
        dispatch(loginUser(loggedUser._id));
        dispatch(loginUserName(loggedUser.name));
        toast.success("Login successful");
      }

      // ✅ Redirect after login
      navigate("/upload");
    } catch (err) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        name="email"
        placeholder="Email"
        value={user.email}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={user.password}
        onChange={handleChange}
      />

      <button onClick={login}>Login</button>

      <p>
        New user? <Link to="/register">Register</Link>
      </p>

      <ToastContainer />
    </div>
  );
};
