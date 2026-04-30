import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Charging from "./Charging/Charging";
import StartSession from "./StartSession/StartSession";
import RegisteredUser from "./RegisteredUsers/RegisteredUsers";
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
