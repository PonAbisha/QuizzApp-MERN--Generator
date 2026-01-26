import { Routes, Route } from "react-router-dom";

/* Layout */
import Navbar from "./Components/layout/Navbar";
import { Footer } from "./Components/Footer/Footer";

/* Pages */
import BookList from "./Pages/BookList";
import QuestionsPage from "./Pages/Questions";
import PagesView from "./Pages/PagesView";
import { Resultshow } from "./Pages/Resultshow";
import { ShowAllAnswers } from "./Pages/ShowAllAnswers";
import UploadBook from "./Pages/UploadBook";

/* Auth */
import { Login } from "./Components/auth/Login";
import { Register } from "./Components/auth/Register";

/* Quiz */
import { Quizes } from "./Components/QuizNew/Quizes";
import QuizHome from "./Pages/QuizHome";

/* Admin */
import { Admin } from "./Components/Admin/Admin";
import { QuizForm } from "./Components/Admin/QuizForm";
import { ProfileMain } from "./Components/Profile/ProfileMain";

/* Protected Route */
import ProtectedRoute from "./Routes/ProtectedRoute";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <BookList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadBook />
            </ProtectedRoute>
          }
        />

        <Route
          path="/questions/:bookId"
          element={
            <ProtectedRoute>
              <QuestionsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pages/:bookId"
          element={
            <ProtectedRoute>
              <PagesView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <QuizHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz/:id"
          element={
            <ProtectedRoute>
              <Quizes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/result"
          element={
            <ProtectedRoute>
              <Resultshow />
            </ProtectedRoute>
          }
        />

        <Route
          path="/showallanswer"
          element={
            <ProtectedRoute>
              <ShowAllAnswers />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/addquiz"
          element={
            <ProtectedRoute>
              <QuizForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileMain />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
  