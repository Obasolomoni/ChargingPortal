import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  function navToggle() {
    setIsOpen(prev => !prev);
  }

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>LFC Charging Portal</div>

      <div style={styles.div}>
        <button style={styles.linkBtn} onClick={() => navigate("/charging")}>
          Home
        </button>
        <button style={styles.linkBtn} onClick={() => navigate("/create")}>
          Add Devices
        </button>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    height: "100%",
    width: "250px",
    padding: "15px 30px",
    background: "#111",
    color: "#fff",
    position: "fixed",
    top: "0",
    left: "0",
    zIndex: "1",
   overFlowx: "hidden",
   paddingTop: "20px", 
  },
  div: {
    display: "flex",
    flexDirection: "Column",
    margin: "20px",  
  },

  logo: {
    fontWeight: "bold",
    fontSize: "18px",
  },
  links: {
    gap: "20px",
    alignItems: "center",
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },
  logoutBtn: {
    background: "red",
    border: "none",
    padding: "6px 12px",
    color: "#fff",
    cursor: "pointer",
  },
  menuBtn: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "20px",
    cursor: "pointer",
  },

};

export default Navbar;