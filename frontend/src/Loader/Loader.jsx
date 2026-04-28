import { useState, useEffect } from "react";
import "./Loader.css";

export default function Loader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="loader-container">
      <div className="loader-content">
        <h1>LFC Charging Portal</h1>
        <div className="spinner"></div>
      </div>
    </div>
  );
}