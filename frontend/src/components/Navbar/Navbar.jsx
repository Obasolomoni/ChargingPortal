import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userName");
    setUserName(storedUser || ""); // ✅ fix null issue
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpenSettings(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* TOP BAR */}
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
        <button onClick={() => navigate("/charging")}>
          Active Session
        </button>
        <button onClick={() => navigate("/create")}>
          Start Session
        </button>
        <button onClick={() => navigate("/registeredUser")}>
          Registered Session
        </button>

        {/* SETTINGS DROPDOWN */}
        <div className="logoutBtn" ref={dropdownRef}>
          <button onClick={() => setOpenSettings((prev) => !prev)}>
            Settings
          </button>

          {openSettings && (
            <div className="settingsPanel">
              <button
                onClick={() => {
                  setOpenModal(true);
                  setOpenSettings(false); // ✅ close dropdown
                }}
              >
                Open Settings
              </button>

              <button onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* MODAL */}
      {openModal && (
        <div
          className="modalOverlay"
          onClick={() => setOpenModal(false)}
        >
          <div
            className="modalContent"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Settings Panel</h2>

            <button>Change Profile</button>
            <button>Change Password</button>
            <button>Update Email</button>

            <button onClick={() => setOpenModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}