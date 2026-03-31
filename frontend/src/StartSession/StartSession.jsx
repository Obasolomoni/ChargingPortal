import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Loader from "../Loader/Loader";

import "./StartSession.css"
function StartSession() {
  const [formData, setFormData] = useState({
    personName: "",
    mobileName: "",
    userNumber: "",
    slotName: "",
    session: "Charging",
    sessionPins: ""
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
        setFormData({
          personName: "",
          mobileName: "",
          userNumber: "",
          slotName: "",
          session: "Charging",
          sessionPins: ""
        });
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Server error");
    }
  };

  const [pins, setPins] = useState([]);

  function generatePins() {
    const newPins = [];

    for (let i = 0; i < 5; i++) {
      const pin = Math.floor(100000 + Math.random() * 900000);
      newPins.push(pin);
    }

    setPins(newPins);
  }

  useEffect(()=> {
    generatePins()
  },[])
  return (
    <>
      <Navbar />
      <Loader />
      <div style={{ marginLeft: "270px", padding: "20px" }}>
        <h3>Start Session</h3>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-grid">
            <input
              name="personName"
              type="text"
              placeholder="Enter Name"
              value={formData.personName}
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
              <option value="select Session">Select Session</option>
              <option value={formData.session}>Charging</option>
              <option value={formData.session}>Pending</option>
            </select>
            <select>
              <option>Select Pins</option>
              {pins.map((pin, i)=>(
                <option key={i}>{pin}</option>
              ))}
            </select>
          </div>

          <button type="submit">Start Session</button>
        </form>
      </div>
    </>
  );
}

export default StartSession;