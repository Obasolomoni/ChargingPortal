import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Charging() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userName: "",
        mobileName: "",
        userNumber: "",
        slotName: "",
        session: "Pending", // 🔥 Default to PENDING
    });

    const [rows, setRows] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // 🔥 Fetch all sessions
    const fetchData = async () => {
        try {
            const res = await fetch("https://chargingportal.onrender.com/api/charge");
            const data = await res.json();
            setRows(data);
        } catch (err) {
            toast.error("Failed to fetch data");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 🔥 Register new session
    const handleSubmit = async () => {
        try {
            const res = await fetch("https://chargingportal.onrender.com/api/charge", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setRows((prev) => [...prev, data.session]);
                toast.success("Device registered!");
                setFormData({
                    userName: "",
                    mobileName: "",
                    userNumber: "",
                    slotName: "",
                    session: "Pending",
                });
                setShowModal(false);
            } else {
                toast.warning(data.message);
            }
        } catch {
            toast.error("Server error");
        }
    };

    // 🔥 Update Charging / Collected session
    const handleSessionChange = async (id, newStatus) => {
        try {
            const nowDate = new Date().toLocaleDateString();
            const nowTime = new Date().toLocaleTimeString();

            const body = {
                session: newStatus,
            };

            if (newStatus === "Charging") {
                body.dateCharged = nowDate;
                body.timeCharged = nowTime;
                body.dateCollected = "";
                body.timeCollected = "";
            }

            if (newStatus === "Collected") {
                body.dateCollected = nowDate;
                body.timeCollected = nowTime;
            }

            const res = await fetch(
                `https://chargingportal.onrender.com/api/charge/${id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                }
            );

            const data = await res.json();

            if (res.ok) {
                setRows((prev) =>
                    prev.map((row) =>
                        row._id === id
                            ? { ...row, ...body }
                            : row
                    )
                );

                toast.success(`Updated to ${newStatus}`);
            } else {
                toast.warning(data.message);
            }
        } catch (error) {
            toast.error("Update failed");
        }
    };

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.id]: e.target.value });

    // 🔥 Filter rows instantly
    const filteredRows = rows.filter((row) =>
        [row.userName, row.userNumber, row.mobileName]
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    // Logout user from the page and clear token
    const handleLogout = () => {
        localStorage.clear();
        toast.info("Logging out...");
        setTimeout(() => navigate("/login"), 1000);
    };

    return (
        <div className="container-fluid px-3 px-md-5 mt-4">
            <ToastContainer position="top-right" autoClose={2000} />

            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <h3 className="fw-bold text-primary text-center text-md-start">
                    ⚡ LFC Charging Portal
                </h3>

                <div className="d-flex flex-wrap gap-2 justify-content-center">
                    <input
                        type="search"
                        className="form-control"
                        placeholder="🔍 Search device, name or number"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ maxWidth: "250px" }}
                    />

                    <button className="btn btn-success" onClick={() => setShowModal(true)}>
                        + Add Session
                    </button>

                    <button className="btn btn-warning" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Add Modal */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Register Device</h5>
                                <button className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>

                            <div className="modal-body">
                                {["userName", "mobileName", "userNumber", "slotName"].map((field) => (
                                    <div className="mb-3" key={field}>
                                        <label className="form-label text-capitalize">{field}</label>
                                        <input
                                            id={field}
                                            type={field === "slotName" ? "number" : "text"}
                                            className="form-control"
                                            value={formData[field]}
                                            onChange={handleChange}
                                        />
                                    </div>
                                ))}

                                {/* Session always starts as Pending */}
                                <div className="mb-3">
                                    <label className="form-label">Session</label>
                                    <select id="session" value={formData.session} className="form-select" onChange={handleChange}>
                                        <option value="Pending">Pending</option>
                                        <option value="Charging">Charging</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary" onClick={handleSubmit}>
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="table-responsive mt-4 shadow-sm rounded">
                <table className="table table-striped table-hover align-middle text-center">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Mobile</th>
                            <th>Number</th>
                            <th>Slot</th>
                            <th>Status</th>
                            <th>Charged Time</th>
                            <th>Charged Date</th>
                            <th>Collected Time</th>
                            <th>Collected Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredRows.length ? (
                            filteredRows.map((rec, i) => (
                                <tr key={rec._id}>
                                    <td>{i + 1}</td>
                                    <td>{rec.userName}</td>
                                    <td>{rec.mobileName}</td>
                                    <td>{rec.userNumber}</td>
                                    <td>{rec.slotName}</td>

                                    <td>
                                        <span
                                            className={`badge ${
                                                rec.session === "Charging"
                                                    ? "bg-success"
                                                    : rec.session === "Pending"
                                                    ? "bg-warning text-dark"
                                                    : "bg-info"
                                            }`}
                                        >
                                            {rec.session}
                                        </span>
                                    </td>

                                    <td>{rec.timeCharged || "---"}</td>
                                    <td>{rec.dateCharged || "---"}</td>
                                    <td>{rec.timeCollected || "---"}</td>
                                    <td>{rec.dateCollected || "---"}</td>

                                    <td>
                                        <select
                                            className="form-select form-select-sm"
                                            value={rec.session}
                                            disabled={rec.session === "Collected"}
                                            onChange={(e) =>
                                                handleSessionChange(rec._id, e.target.value)
                                            }
                                        >
                                            <option value="Charging">Charging</option>
                                            <option value="Collected">Collected</option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="11" className="text-muted">
                                    No sessions found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Charging;
