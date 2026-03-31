import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./Charging.css";

import Navbar from "../Navbar/Navbar";
import Loader from "../Loader/Loader";
function Charging() {
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all sessions
  const fetchData = async () => {
    try {
      const res = await fetch("https://chargingportal.onrender.com/api/charge");
      const data = await res.json();
      setRows(data);
    } catch (err) {
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update session
  async function handleSessionChange(id, newStatus) {
    try {
      const nowDate = new Date().toLocaleDateString();
      const nowTime = new Date().toLocaleTimeString();

      const body = { session: newStatus };

      if (newStatus === "Charging") {
        body.dateCharged = nowDate;
        body.timeCharged = nowTime;
        body.dateCollected = "";
        body.timeCollected = "";
      }

      if (newStatus === "Collected") {
        body.dateCollected = nowDate;
        body.timeCollected = nowTime;
      }

      const res = await fetch(`https://chargingportal.onrender.com/api/charge/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        setRows((prev) =>
          prev.map((row) => (row._id === id ? { ...row, ...body } : row))
        );
        toast.success(`Updated to ${newStatus}`);
      } else {
        toast.warning(data.message);
      }
    } catch {
      toast.error("Update failed");
    }
  }

  const filteredRows = rows.filter((row) =>
    [row.personName, row.userNumber, row.mobileName]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
  
  <>
  <Loader />
  <Navbar />
    <div className="charging-container">
      <ToastContainer position="top-right" autoClose={2000} />

      <h2>Charging Sessions</h2>

      <input
        type="text"
        placeholder="Search user, number, or mobile..."
        className="searchInput"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Mobile</th>
              <th>Number</th>
              <th>Slot</th>
              <th>Status</th>
              <th>Charged Time</th>
              <th>Charged Date</th>
              <th>Collected Time</th>
              <th>Collected Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredRows.length ? (
              filteredRows.map((rec, i) => (
                <tr key={rec._id}>
                  <td>{i + 1}</td>
                  <td>{rec.personName}</td>
                  <td>{rec.mobileName}</td>
                  <td>{rec.userNumber}</td>
                  <td>{rec.slotName}</td>
                  <td>
                    <span
                      className={`badge ${
                        rec.session === "Charging"
                          ? "badge-charging"
                          : rec.session === "Pending"
                          ? "badge-pending"
                          : "badge-collected"
                      }`}
                    >
                      {rec.session}
                    </span>
                  </td>
                  <td>{rec.timeCharged}</td>
                  <td>{rec.dateCharged}</td>
                  <td>{rec.timeCollected}</td>
                  <td>{rec.dateCollected}</td>
                  <td>
                    <select
                      value={rec.session}
                      disabled={rec.session === "Collected"}
                      onChange={(e) =>
                        handleSessionChange(rec._id, e.target.value)
                      }
                    >
                      <option value="Charging">Charging</option>
                      <option value="Collected">Collected</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="emptyRow">
                  No sessions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}

export default Charging;