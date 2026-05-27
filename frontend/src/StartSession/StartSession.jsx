import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Loader from "../Loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./StartSession.css";

function StartSession() {
  const [pins, setPins] = useState([]);
  const [formData, setFormData] = useState({
    personName: "",
    mobileName: "",
    userNumber: "",
    slotName: "",
    session: "Charging",
    Registrar: "",
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

  // 🔥 Submit session
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("https://chargingportal.onrender.com/api/charge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` // ✅ FIXED
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Session created! Pin: ${data.assignedPin}`);

        setFormData({
          personName: "",
          mobileName: "",
          userNumber: "",
          slotName: "",
          session: "Charging",
          sessionPins: ""
        });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  const fetchPins = async () => {
    try {
      const res = await fetch("https://chargingportal.onrender.com/api/pins");
      const data = await res.json();

      if (res.ok) {
        setPins(data.pins);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to fetch pins");
    }
  };

  useEffect(() => {
    fetchPins();
  }, []);

  return (
    <>
      <Navbar />
      <Loader />
      <ToastContainer />

      <div className="form-container">
        <h3>Start Session</h3>

        <form onSubmit={handleSubmit}>
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

            {/* ✅ FIXED select */}
            <select
              name="session"
              value={formData.session}
              onChange={handleChange}
              className="selectBar"
            >
              <option value="Charging">Charging</option>
              <option value="Pending">Pending</option>
            </select>

            <select
              name="sessionPins"
              value={formData.sessionPins}
              onChange={handleChange}
              className="selectBar"
            >
              <option value="">Select Pin</option>

              {pins.map((pin, index) => (
                <option key={index} value={pin}>
                  {pin}
                </option>
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