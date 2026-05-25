import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("userName");
    setUserName(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* TOP BAR ALWAYS VISIBLE */}
      <div className="topbar">
        <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </div>
        <div className="logo">LFC Charging Portal</div>
        <div className="user">
          {userName ? `Hi, ${userName}` : "Guest"}
        </div>
      </div>

      {/* SIDEBAR */}
      <nav className={isOpen ? "sidebar open" : "sidebar"}>
        <button onClick={() => navigate("/charging")}>Active Session</button>
        <button onClick={() => navigate("/create")}>Start Session</button>
        <button onClick={() => navigate("/registeredUser")}>
          Registered Session
        </button>

        <div className="logoutBtn">
                  <button onClick={handleLogout}>
          Logout
        </button>
        </div>

      </nav>
    </>
  );
}