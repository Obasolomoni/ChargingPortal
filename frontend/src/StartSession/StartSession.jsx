import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";

import "./StartSession.css"
function StartSession() {
  const [formData, setFormData] = useState({
    userName: "",
    mobileName: "",
    userNumber: "",
    slotName: "",
    session: "Charging"
  });

  
  // 🔥 Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // 🔥 Register new session
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    try {
      const res = await fetch("https://chargingportal.onrender.com/api/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Device registered!"); // temporary instead of toast
        setFormData({
          userName: "",
          mobileName: "",
          userNumber: "",
          slotName: "",
          session: "Charging"
        });
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <>
      <Navbar />

      <div style={{ marginLeft: "270px", padding: "20px" }}>
        <h3>Start Session</h3>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-grid">
            <input
              name="userName"
              type="text"
              placeholder="Enter Name"
              value={formData.userName}
              onChange={handleChange}
            />
            <input
              name="userNumber"
              type="text"
              placeholder="Enter Phone Number"
              value={formData.userNumber}
              onChange={handleChange}
            />
            <input
              name="mobileName"
              type="text"
              placeholder="Enter Mobile Name"
              value={formData.mobileName}
              onChange={handleChange}
            />
            <input
              name="slotName"
              type="text"
              placeholder="Enter Slot Name"
              value={formData.slotName}
              onChange={handleChange}
            />
            <select className="selectBar">
              <option value={formData.session}>Charging</option>
              <option value={formData.session}>Pending</option>
              </select>
              <select>

                <option>Show More</option>
              </select>
          </div>

          <button type="submit">Start Session</button>
        </form>
      </div>
    </>
  );
}

export default StartSession;