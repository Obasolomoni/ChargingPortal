import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import StatsCard from "../../components/Dashboard/StatsCard";

import {
  getDashboardStats,
  getChargingStats
} from "../../services/dashboardServices";

import "./Dashboard.css";

export default function DashboardStats() {

  // Dashboard numbers
  const [stats, setStats] = useState({
    totalSessions: 0,
    chargingCount: 0,
    pendingCount: 0,
    collectedCount: 0
  });

  // Search
  const [search, setSearch] = useState("");

  // Search results
  const [sessions, setSessions] = useState([]);


  // =========================
  // FETCH DASHBOARD NUMBERS
  // =========================

  useEffect(() => {

    const fetchStats = async () => {

      try {

        const data = await getDashboardStats();

        setStats(data);

      } catch (err) {

        toast.error("Dashboard data not found");

      }

    };

    fetchStats();

  }, []);


  // =========================
  // SEARCH SESSIONS
  // =========================

  const handleSearch = async (value) => {

    setSearch(value);

    // Don't search if input is empty
    if (!value.trim()) {

      setSessions([]);

      return;
    }

    try {

      const data = await getChargingStats(value);

      setSessions(data);

    } catch (err) {

      toast.error("Unable to search sessions");

    }

  };


  return (
    <div className="dashboard">

      <h1>Dashboard</h1>


      {/* =========================
          DASHBOARD STATISTICS
      ========================= */}

      <div className="stats-grid">

        <StatsCard
          title="Total Sessions"
          value={stats.totalSessions}
        />

        <StatsCard
          title="Charging"
          value={stats.chargingCount}
        />

        <StatsCard
          title="Pending"
          value={stats.pendingCount}
        />

        <StatsCard
          title="Collected"
          value={stats.collectedCount}
        />

      </div>


      {/* =========================
          DEVICE TRACKER
      ========================= */}

      <div className="device-tracker">

        <h2>Track Device</h2>

        <input
          type="text"
          placeholder="Search device, name, number or PIN..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />


        {/* SEARCH RESULTS */}

        <div className="tracker-results">

          {sessions.length === 0 && search.trim() && (
            <p>No session found.</p>
          )}


          {sessions.map((item) => (

            <div
              className="tracker-card"
              key={item._id}
            >

              <h3>{item.mobileName}</h3>

              <p>
                <strong>Session:</strong>{" "}
                {item.session}
              </p>

              <p>
                <strong>Registrar:</strong>{" "}
                {item.Registrar}
              </p>

              <p>
                <strong>Date & Time:</strong>{" "}
                {new Date(item.createdAt).toLocaleString()}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}