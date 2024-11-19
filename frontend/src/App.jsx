import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Signup from "./pages/login/SignUp";
import Dashboard from "./pages/judges/Dashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />}
        />
        <Route
          path="/dashboard/*"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;