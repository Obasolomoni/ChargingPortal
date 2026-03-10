import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <nav>
      <div className="logo">LFC Charging Portal</div>

      <div className="nav-links">
        <button className="linkBtn" onClick={() => navigate("/charging")}>
          Active Session
        </button>
        <button className="linkBtn" onClick={() => navigate("/create")}>
          Start Session
        </button>
        <button className="logoutBtn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;