const API =
  "http://localhost:2000/dashboard";

export default async function getDashboardStats() {
  const res = await fetch(
    `${API}/dashboard`
  );

  return res.json();
};