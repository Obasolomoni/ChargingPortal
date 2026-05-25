import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./Register.css"
import Loader from "../Loader/Loader";
export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userName: "",
    userEmail: "",
    userPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    // clear old session
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://chargingportal.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      console.log("Response:", data);

      if (res.ok) {
        toast.success("🎉 Registration successful!");

        // ✅ SAVE TOKEN + USERNAME
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.userName);

        setTimeout(() => navigate("/charging"), 1500);
      } else {
        toast.warn(`⚠️ ${data.message}`);
      }

    } catch (err) {
      console.error(err);
      toast.error("❌ Server error, please try again.");
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <>
    <Loader />
    <div className="authLayout">

      {/* LEFT SIDE */}
      <div className="leftSide">
        <h2>Welcome 👋</h2>
        <p>Already have an account?</p>
        <button type="button" className="btn primary" onClick={handleLogin}>
          Login
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="rightSide">
        <form onSubmit={handleSubmit} className="formCard">
          <h4 className="title">Register</h4>
          <p>Create an account to continue</p>
          <input
            className="input"
            name="userName"
            placeholder="Username"
            value={form.userName}
            onChange={handleChange}
          />

          <input
            className="input"
            name="userEmail"
            type="email"
            placeholder="Email"
            value={form.userEmail}
            onChange={handleChange}
          />

          <input
            className="input"
            name="userPassword"
            type="password"
            placeholder="Password"
            value={form.userPassword}
            onChange={handleChange}
          />

          <button type="submit" className="btn secondary">
            Register
          </button>
        </form>
      </div>

    </div>
    </>
  );
}