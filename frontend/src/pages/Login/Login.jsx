import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./Login.css";
import Loader from "../../components/Loader/Loader";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userName: "",
    userPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://chargingportal.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("✅ Login successful!");

        // 🔥 FIXED
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.userName);

        setTimeout(() => navigate("/charging"), 1000);
      } else {
        toast.warn(`⚠️ ${data.message}`);
      }

    } catch (err) {
      console.error(err);
      toast.error("❌ Server error, please try again.");
    }
  };

  const handleRegister = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <>
    <Loader />
  <div className="authLayout">

  {/* LEFT SIDE */}
  <div className="left">
    <div className="centered">
      <img src="" alt="winnerslogo" />
      <h3>Welcome Back!</h3>
      <p>Don't have an account yet?</p>
      <button onClick={handleRegister} className="btn secondary">
        Register
      </button>
    </div>
  </div>

  {/* RIGHT SIDE */}
  <div className="right">
    <ToastContainer />

    <form onSubmit={handleSubmit} className="formContainer">
      <h4>Login</h4>
      <p>click here to continue</p>
      <input
        className="input"
        name="userName"
        placeholder="Username"
        value={form.userName}
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

      <button type="submit" className="btn primary">
        Login
      </button>
    </form>
  </div>

</div>
</>
  );
}