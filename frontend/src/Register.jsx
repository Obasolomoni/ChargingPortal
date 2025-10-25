import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ userName: "", email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:2000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Registered successfully!");
        localStorage.setItem("token", data.token);
        setTimeout(() => navigate("/charging"), 1500);
      } else toast.warn(data.message);
    } catch (err) {
      toast.error("Server error!");
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="card p-4 mx-auto" style={{ maxWidth: 400 }}>
        <h4 className="mb-3">Register</h4>
        <input name="userName" className="form-control mb-2" placeholder="Username" onChange={handleChange} />
        <input name="email" type="email" className="form-control mb-2" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" className="form-control mb-2" placeholder="Password" onChange={handleChange} />
        <button className="btn btn-primary w-100">Register</button>
      </form>
    </div>
  );
}
