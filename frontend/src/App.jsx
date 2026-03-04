import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Charging from "./Charging";
import StartSession from "./StartSession";
import ProtectedRoute from "./ProtectedRoute"; // ✅ Ensure this matches your file name
import "./index.css";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<StartSession />} />

        {/* Protected Route */}
        <Route
          path="/charging"
          element={
            <ProtectedRoute>
              <Charging />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
