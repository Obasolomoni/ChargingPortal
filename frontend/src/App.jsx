import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Charging from "./Charging";
import ProtectedRoute from "./ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
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
