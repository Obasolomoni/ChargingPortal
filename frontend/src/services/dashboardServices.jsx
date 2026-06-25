const API =
  "https://chargingportal.onrender.com/api/dashboard/stats";

export default async function getDashboardStats() {
  const res = await fetch(
    `${API}/dashboard/stats`
  );

  return res.json();
};