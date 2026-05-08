import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <ToastContainer />

      <form onSubmit={handleSubmit} className="card p-4 shadow">
        <h4 className="mb-3 text-center text-success">Register</h4>

        <input
          name="userName"
          className="form-control mb-3"
          placeholder="Username"
          value={form.userName}
          onChange={handleChange}
        />

        <input
          name="userEmail"
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={form.userEmail}
          onChange={handleChange}
        />

        <input
          name="userPassword"
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={form.userPassword}
          onChange={handleChange}
        />

        <button type="submit" className="btn btn-success w-100 mb-2">
          Register
        </button>

        <button
          type="button"
          className="btn btn-primary w-100"
          onClick={handleLogin}
        >
          Login
        </button>
      </form>
    </div>
  );
}