import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import './RegisteredUsers.css'
export default function RegisteredUsers() {
  const [registered, setRegistered] = useState([]);
  const [modalSession, setModalSession] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [displayData, setDisplayData] = useState({
    personName: "",
    mobileName: "",
    userNumber: "",
    slotName: "",
    session: "Charging",
    sessionPins: ""
  });

  // handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDisplayData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // submit session
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://chargingportal.onrender.com/api/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(displayData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Session created!");
        setDisplayData({
          personName: "",
          mobileName: "",
          userNumber: "",
          slotName: "",
          session: "Charging",
          sessionPins: ""
        });
        setModalSession(false);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  const fetchUsername = async () => {
    try {
      const res = await fetch("https://chargingportal.onrender.com/api/auth/register");
      const data = await res.json();
      setRegistered(data);
    } catch (err) {
      toast.error("Failed to fetch data");
    }
  };

  // fetch users
  const fetchRegistered = async () => {
    try {
      const res = await fetch("https://chargingportal.onrender.com/api/charge");
      const data = await res.json();
      setRegistered(data);
    } catch (err) {
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchRegistered();
    fetchUsername();
  }, []);

  const registeredRows = registered.filter((r) =>
    [r.personName, r.userNumber, r.mobileName]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className='registered-container'>
        <ToastContainer />
        <h1>All Registered Users</h1>

        <input
          type="text"
          placeholder="Search user..."
          value={searchTerm}
          className='searchInput'
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className='table-wrapper'>
          <table>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Registrar Name</th>
                <th>Persons Name</th>
                <th>Mobile Name</th>
                <th>Number</th>
                <th>Session</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {registeredRows.length ? (
                registeredRows.map((reg, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{reg.userName}</td>
                    <td>{reg.personName}</td>
                    <td>{reg.mobileName}</td>
                    <td>{reg.userNumber}</td>
                    <td>{reg.session}</td>
                    <td>
                      <button onClick={() => setModalSession(true)}>
                        Create Session
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>


      {modalSession && (
        <div className="modal-overlay">
          <div className="reRegister">
            <h3>Start Session</h3>

            <form onSubmit={handleSubmit} className="form-container">
              <input name="personName" value={displayData.registrar} onChange={handleChange} placeholder="Registrar Name" />
              <input name="personName" value={displayData.personName} onChange={handleChange} placeholder="Owners Name" />
              <input name="userNumber" value={displayData.userNumber} onChange={handleChange} placeholder="Phone Number" />
              <input name="mobileName" value={displayData.mobileName} onChange={handleChange} placeholder="Device Name" />
              <input name="slotName" value={displayData.slotName} onChange={handleChange} placeholder="Slot Number" />
              <input name="sessionPins" value={displayData.sessionPins} onChange={handleChange} placeholder="Pins" />

              <div className="form-actions">
                <button type="submit" className="btn-primary">Start Session</button>
                <button type="button" className="btn-secondary" onClick={() => setModalSession(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}