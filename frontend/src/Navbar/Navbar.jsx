import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState([]);

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }


  const fetchUserName = async () => {
    try {
      const res = await fetch("https://chargingportal.onrender.com/api/auth/user");
      const data = await res.json();
      setUserName(data.registrar);
    } catch (err) {
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchUserName();
  }, []);

  return (
    <nav>
      <ToastContainer />
      <div className="logo">LFC Charging Portal</div>

      <div className="profile">
        <div>
          {userName ? `Welcome ${userName}` : 'Guest'}
        </div>
        <div>
          
          <div className="nav-links">
            <button className="linkBtn" onClick={() => navigate("/charging")}>
              Active Session
            </button>
            <button className="linkBtn" onClick={() => navigate("/create")}>
              Start Session
            </button>
            <button className="linkBtn" onClick={() => navigate("/registeredUser")}>
              Registered Session
            </button>
          </div>


          <button className="logoutBtn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

    </nav>
  );
}

export default Navbar;