import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Charging from "./pages/Charging/Charging";
import StartSession from "./pages/StartSession/StartSession";
import RegisteredUser from "./pages/RegisteredUsers/RegisteredUsers";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute"; // ✅ Ensure this matches your file name
import "./index.css";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<StartSession />} />
          <Route path="/registeredUser" element={<RegisteredUser />} />
          <Route path="/adminDashboard" element={<Dashboard />} />


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
    </>
  );
}
