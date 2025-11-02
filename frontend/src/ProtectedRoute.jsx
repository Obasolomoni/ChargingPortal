import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // if token is missing or invalid → redirect to login
  if (!token || token === "undefined" || token === "null") {
    return <Navigate to="/login" replace />;
  }

  // if token exists → grant access
  return children;
}
