// src/Redux/action.js
// Central minimal action creators used by the app.
// These are lightweight thunks / action objects to satisfy imports.
// Update endpoints to match your backend routes.

import axios from "axios";

/* Action type constants */
export const FETCH_QUIZ_REQUEST = "FETCH_QUIZ_REQUEST";
export const FETCH_QUIZ_SUCCESS = "FETCH_QUIZ_SUCCESS";
export const FETCH_QUIZ_FAILURE = "FETCH_QUIZ_FAILURE";

export const GET_CURRENT_QUIZ_REQUEST = "GET_CURRENT_QUIZ_REQUEST";
export const GET_CURRENT_QUIZ_SUCCESS = "GET_CURRENT_QUIZ_SUCCESS";
export const GET_CURRENT_QUIZ_FAILURE = "GET_CURRENT_QUIZ_FAILURE";

export const GET_COUNT_SUCCESS = "GET_COUNT_SUCCESS";

/* API base */
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

/* Basic action creators */
export const fetchQuizRequest = () => ({ type: FETCH_QUIZ_REQUEST });
export const fetchQuizSuccess = (payload) => ({ type: FETCH_QUIZ_SUCCESS, payload });
export const fetchQuizFailure = (err) => ({ type: FETCH_QUIZ_FAILURE, payload: err });

export const getCurrentQuizRequest = (quizId) => ({ type: GET_CURRENT_QUIZ_REQUEST, payload: quizId });
export const getCurrentQuizSuccess = (quiz) => ({ type: GET_CURRENT_QUIZ_SUCCESS, payload: quiz });
export const getCurrentQuizFailure = (err) => ({ type: GET_CURRENT_QUIZ_FAILURE, payload: err });

export const getCountSuccess = (count) => ({ type: GET_COUNT_SUCCESS, payload: count });

/* Thunks / exported functions referenced across the app */

// fetchQuizDataFrombackend (NewQuizPage)
export const fetchQuizDataFrombackend = (params = {}) => {
  return async (dispatch) => {
    dispatch(fetchQuizRequest());
    try {
      const res = await axios.get(`${API_BASE}/quizzes`, { params });
      dispatch(fetchQuizSuccess(res.data));
      return res.data;
    } catch (err) {
      dispatch(fetchQuizFailure(err.message || err));
      throw err;
    }
  };
};

// getAllUserDataFromBackend (Admin.jsx)
export const getAllUserDataFromBackend = () => {
  return async (dispatch) => {
    try {
      const res = await axios.get(`${API_BASE}/admin/users`);
      return res.data;
    } catch (err) {
      console.error("getAllUserDataFromBackend error:", err);
      throw err;
    }
  };
};

// quizSuccess (QuizForm.jsx) - simple wrapper
export const quizSuccess = (quizObj) => {
  return (dispatch) => {
    dispatch(fetchQuizSuccess(quizObj));
  };
};

// postQuizObj (QuizForm.jsx) - create quiz
export const postQuizObj = (quizObj) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(`${API_BASE}/admin/quiz`, quizObj);
      dispatch(fetchQuizSuccess(res.data));
      return res.data;
    } catch (err) {
      dispatch(fetchQuizFailure(err.message || err));
      throw err;
    }
  };
};

// deleteUserByAdmin (UserdetailForAdmin.jsx)
export const deleteUserByAdmin = (userId) => {
  return async (dispatch) => {
    try {
      const res = await axios.delete(`${API_BASE}/admin/user/${userId}`);
      return res.data;
    } catch (err) {
      console.error("deleteUserByAdmin error:", err);
      throw err;
    }
  };
};

// Logouthandleraction (Navbar)
export const Logouthandleraction = () => {
  return (dispatch) => {
    try {
      localStorage.removeItem("token");
      dispatch(fetchQuizFailure(null));
      return true;
    } catch (err) {
      console.error("Logout error:", err);
      return false;
    }
  };
};

// postUserResult (Quiz.jsx)
export const postUserResult = (resultObj) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(`${API_BASE}/userResult`, resultObj);
      return res.data;
    } catch (err) {
      console.error("postUserResult error:", err);
      throw err;
    }
  };
};

// postQuizResult (Quiz.jsx)
export const postQuizResult = (quizResult) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(`${API_BASE}/quiz/result`, quizResult);
      return res.data;
    } catch (err) {
      console.error("postQuizResult error:", err);
      throw err;
    }
  };
};

// getQuiz (Quizes.jsx)
export const getQuiz = (params = {}) => {
  return async (dispatch) => {
    try {
      const res = await axios.get(`${API_BASE}/quizzes`, { params });
      dispatch(fetchQuizSuccess(res.data));
      return res.data;
    } catch (err) {
      dispatch(fetchQuizFailure(err.message || err));
      throw err;
    }
  };
};

// NOTE: login itself is handled directly in Login.jsx via axios.post(`${API_BASE}/login`, ...),
// which then dispatches GETUSERID/GETUSERNAME or GETADMINID/GETADMINNAME (see Redux/actiontype.js
// and Redux/reducer.js) with the correct `loggedUser.id` field from the backend response.
// The previous loginUser/loginUserName/loginAdminId/loginAdminName helpers here were removed:
// - loginUser posted to a nonexistent `/auth/login` route (the real route is `/login`) and
//   was never actually wired to Login.jsx's dispatch calls correctly.
// - loginUserName/loginAdminId/loginAdminName all dispatched fetchQuizSuccess(), which only
//   ever wrote to state.QuizData instead of state.userId/userName/adminId/adminName.
