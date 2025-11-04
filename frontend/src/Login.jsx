import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ userName: "", userPassword: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:2000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("✅ Login successful!");
        localStorage.setItem("token", data.token);
        setTimeout(() => navigate("/charging"), 1500);
      } else {
        toast.warn(`⚠️ ${data.message}`);
      }
    } catch (err) {
      toast.error("❌ Server error, please try again.");
    }
  };

  const handleRegister = () => {
    // clear token just in case
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="card p-4 shadow">
        <h4 className="mb-3 text-center text-primary">Login</h4>
        <input
          name="userName"
          className="form-control mb-3"
          placeholder="Username"
          value={form.userName}
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
        <button type="submit" className="btn btn-primary w-100 mb-2">
          Login
        </button>
        <button
          type="button"
          className="btn btn-warning w-100"
          onClick={handleRegister}
        >
          Register
        </button>
      </form>
    </div>
  );
}
