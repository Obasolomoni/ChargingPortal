import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../components/Navbar/Navbar";
import StatsCard from "../../components/Dashboard/StatsCard";

import getDashboardStats from "../../services/dashboardServices";

import "./Dashboard.css";

function Dashboard() {

  const [stats, setStats] = useState({
    totalSessions: 0,
    chargingCount: 0,
    pendingCount: 0,
    collectedCount: 0
  });

  useEffect(() => {

    const fetchStats = async () => {
      try {

        const data = await getDashboardStats();
        setStats(data);
        toast.success("Data fetched successfully")

      } catch (err) {
        toast.error("Data Not Found");
      }
    };

    fetchStats();

  }, []);

  return (
    <>
      <Navbar />

      <div className="dashboard">

        <h1>Dashboard</h1>

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

      </div>
    </>
  );
}

export default Dashboard;