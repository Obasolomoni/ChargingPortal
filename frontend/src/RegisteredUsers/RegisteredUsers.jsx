import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './RegisteredUsers.css';

export default function RegisteredUsers() {
  const [registered, setRegistered] = useState([]);
  const [modalSession, setModalSession] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [displayData, setDisplayData] = useState({
    personName: "",
    mobileName: "",
    userNumber: "",
    slotName: "",
    session: "Charging"
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
      const token = localStorage.getItem("token");

      const res = await fetch("https://chargingportal.onrender.com/api/charge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` // ✅ FIXED
        },
        body: JSON.stringify(displayData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Session created! Pin: ${data.assignedPin}`);

        setDisplayData({
          personName: "",
          mobileName: "",
          userNumber: "",
          slotName: "",
          session: "Charging"
        });

        setModalSession(false);
        fetchRegistered(); // ✅ refresh table
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  // fetch users/sessions
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
                <th>Registrar</th>
                <th>Person</th>
                <th>Mobile</th>
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
                    <td>{reg.registrar}</td>
                    <td>{reg.personName}</td>
                    <td>{reg.mobileName}</td>
                    <td>{reg.userNumber}</td>
                    <td>{reg.session}</td>
                    <td>
                      <button
                        onClick={() => {
                          // ✅ auto-fill form
                          setDisplayData({
                            personName: reg.personName,
                            mobileName: reg.mobileName,
                            userNumber: reg.userNumber,
                            slotName: "",
                            session: "Charging"
                          });
                          setModalSession(true);
                        }}
                      >
                        Create Session
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalSession && (
        <div className="modal-overlay">
          <div className="reRegister">
            <h3>Start Session</h3>

            <form onSubmit={handleSubmit} className="form-container">
              <input
                name="personName"
                value={displayData.personName}
                onChange={handleChange}
                placeholder="Owner's Name"
              />
              <input
                name="userNumber"
                value={displayData.userNumber}
                onChange={handleChange}
                placeholder="Phone Number"
              />
              <input
                name="mobileName"
                value={displayData.mobileName}
                onChange={handleChange}
                placeholder="Device Name"
              />
              <input
                name="slotName"
                value={displayData.slotName}
                onChange={handleChange}
                placeholder="Slot Number"
              />

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Start Session
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setModalSession(false)}
                >
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