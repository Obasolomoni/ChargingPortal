import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Loader from "../Loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./StartSession.css";

function StartSession() {
  const [loading, setLoading] = useState(false);
  const [generatedPin, setGeneratedPin] = useState("");
  const [displayPin, setDisplayPin] = useState(false);

  const [formData, setFormData] = useState({
    personName: "",
    mobileName: "",
    userNumber: "",
    slotName: "",
    session: "Charging",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Automatically hide PIN after 5 seconds
  useEffect(() => {
    if (!generatedPin) return;

    setDisplayPin(true);

    const timer = setTimeout(() => {
      setDisplayPin(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [generatedPin]);

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.personName || !formData.mobileName) {
      return toast.error("Please fill all required fields");
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://chargingportal.onrender.com/api/charge",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setGeneratedPin(data.assignedPin);

        toast.success("Charging session started successfully.");

        setFormData({
          personName: "",
          mobileName: "",
          userNumber: "",
          slotName: "",
          session: "Charging",
        });
      } else {
        toast.error(data.message || "Unable to start session.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Loader />
      <ToastContainer />

      <div className="form-container">
        <h3>Start Charging Session</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <input
              name="personName"
              type="text"
              placeholder="Customer Name"
              value={formData.personName}
              onChange={handleChange}
              required
            />

            <input
              name="userNumber"
              type="text"
              placeholder="Phone Number"
              value={formData.userNumber}
              onChange={handleChange}
            />

            <input
              name="mobileName"
              type="text"
              placeholder="Phone Model"
              value={formData.mobileName}
              onChange={handleChange}
              required
            />

            <input
              name="slotName"
              type="text"
              placeholder="Charging Slot"
              value={formData.slotName}
              onChange={handleChange}
            />

            <select
              name="session"
              value={formData.session}
              onChange={handleChange}
              className="selectBar"
            >
              <option value="Charging">Charging</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Generating PIN..." : "Start Session"}
          </button>
        </form>

        {displayPin && generatedPin && (
          <div className="pinBox">
            <h3>Charging Session PIN</h3>

            <h1>{generatedPin}</h1>

            <p>
              Give this PIN to the customer after starting the charging session.
            </p>

            <div className="pin-actions">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedPin);
                  toast.success("PIN copied!");
                }}
              >
                Copy PIN
              </button>

              <button
                onClick={() => {
                  setGeneratedPin("");
                  setDisplayPin(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default StartSession;