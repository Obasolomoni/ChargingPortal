import { useState, useEffect } from "react"

import "./StatsCard.css"
export default function StatsCard({ title, value }) {
  return (
    <div className="stat-card">
      <h3>{title}</h3>
      <h1>{value}</h1>
    </div>
  );
}