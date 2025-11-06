import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Charging() {
    const navigate = useNavigate();

    // ✅ States
    const [formData, setFormData] = useState({
        userName: "",
        mobileName: "",
        userNumber: "",
        slotName: "",
        session: "",
    });
    const [rows, setRows] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const recordsPerPage = 10;

    // ✅ Fetch sessions from backend
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

    // ✅ Filter instantly as user types
    const filteredRecords = rows.filter((row) =>
        [row.userName, row.mobileName, row.userNumber, row.slotName]
            .some((value) =>
                value?.toLowerCase().includes(searchTerm.toLowerCase())
            )
    );

    // ✅ Pagination based on filtered results
    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
    const currentRecords = filteredRecords.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    // ✅ Reset to page 1 on new search
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // ✅ Warn only if user types 3+ letters and no match
    useEffect(() => {
        if (searchTerm.trim().length > 2 && filteredRecords.length === 0) {
            toast.warning("No matching records found");
        }
    }, [searchTerm, filteredRecords]);

    // ✅ Submit new session
    const handleSubmit = async (status) => {
        try {
            const res = await fetch("https://chargingportal.onrender.com/api/charge", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setRows((prev) => [...prev, data.session]);
                toast.success("Session added!");
                setFormData({
                    userName: "",
                    mobileName: "",
                    userNumber: "",
                    slotName: "",
                    session: "",
                });
                setShowModal(false);
            } else {
                toast.warning(data.message);
            }
        } catch {
            toast.error("Server error");
        }

        if (status === "Pending") ({
            timeCharged:
            status === "Charging" ? new Date().toLocaleTimeString() : "",
                dateCharged:
            status === "Charging" ? new Date().toLocaleDateString() : "",
        })
    };

    // ✅ Update session when collected
    const handleSessionChange = async (id, newStatus) => {
        try {
            const res = await fetch(`https://chargingportal.onrender.com/api/charge/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session: newStatus,
                    timeCharged:
                        newStatus === "Charging" ? new Date().toLocaleTimeString() : "",
                    dateCharged:
                        newStatus === "Charging" ? new Date().toLocaleDateString() : "",
                    timeCollected:
                        newStatus === "Collected" ? new Date().toLocaleTimeString() : "",
                    dateCollected:
                        newStatus === "Collected" ? new Date().toLocaleDateString() : "",
                }),
            });

            const data = await res.json();

            if (res.ok) {
                // ✅ Force update local state
                setRows((prev) =>
                    prev.map((row) =>
                        row._id === id
                            ? {
                                ...row,
                                session: newStatus,
                                ...(newStatus === "Charging" && {
                                    timeCharged: new Date().toLocaleTimeString(),
                                    dateCharged: new Date().toLocaleDateString(),
                                    timeCollected: "",
                                    dateCollected: "",
                                }),
                                ...(newStatus === "Collected" && {
                                    timeCollected: new Date().toLocaleTimeString(),
                                    dateCollected: new Date().toLocaleDateString(),
                                }),
                            }
                            : row
                    )
                );

                toast.success(`✅ Session changed to ${newStatus}`);
            } else {
                toast.warning(data.message || "Failed to update session");
            }
        } catch (error) {
            console.error("Error updating session:", error);
            toast.error("Server error");
        }
    };


    // ✅ Handle form input
    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.id]: e.target.value });

    const handleLogout = () => {
        localStorage.clear();
        toast.info("Logging out...");
        setTimeout(() => navigate("/login"), 1000);
    };

    return (
        <div className="container-fluid px-3 px-md-5 mt-4">
            <ToastContainer position="top-right" autoClose={2000} />

            {/* 🌟 Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <h3 className="fw-bold text-primary text-center text-md-start">
                    ⚡ LFC Charging Portal
                </h3>

                {/* ✅ Search (Instant) */}
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                    <input
                        type="search"
                        className="form-control w-150 w-md-auto"
                        placeholder="🔍 Search by name, phone, number or slot"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ maxWidth: "350px" }}
                    />
                    <button className="btn btn-success" onClick={() => setShowModal(true)}>
                        + Add Session
                    </button>
                    <button className="btn btn-warning" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            {/* 🌟 Modal */}
            {showModal && (
                <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Add Charging Session</h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {["userName", "mobileName", "userNumber", "slotName"].map(
                                    (field) => (
                                        <div className="mb-3" key={field}>
                                            <label className="form-label text-capitalize">
                                                {field}
                                            </label>
                                            <input
                                                id={field}
                                                type={field === "slotName" ? "number" : "text"}
                                                className="form-control"
                                                value={formData[field]}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    )
                                )}
                                <div className="mb-3">
                                    <label className="form-label">Session</label>
                                    <select
                                        id="session"
                                        value={formData.session}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="">Select</option>
                                        <option value="Charging">Charging</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Discharging">Discharging</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
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

            {/* 🌟 Table */}
            <div className="table-responsive mt-4 shadow-sm rounded">
                <table className="table table-striped table-hover align-middle text-center">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>User Name</th>
                            <th>Mobile</th>
                            <th>Number</th>
                            <th>Slot</th>
                            <th>Session</th>
                            <th>Time Charged</th>
                            <th>Date Charged</th>
                            <th>Time Collected</th>
                            <th>Date Collected</th>
                            <th>Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRecords.length ? (
                            currentRecords.map((rec, i) => (
                                <tr key={rec._id}>
                                    <td>{i + 1}</td>
                                    <td>{rec.userName}</td>
                                    <td>{rec.mobileName}</td>
                                    <td>{rec.userNumber}</td>
                                    <td>{rec.slotName}</td>
                                    <td>
                                        <span
                                            className={`badge ${rec.session === "Charging"
                                                ? "bg-success"
                                                : rec.session === "Pending"
                                                    ? "bg-warning text-dark"
                                                    : rec.session === "Collected"
                                                        ? "bg-info text-dark"
                                                        : "bg-secondary"
                                                }`}
                                        >
                                            {rec.session}
                                        </span>
                                    </td>
                                    <td>{rec.timeCharged}</td>
                                    <td>{rec.dateCharged}</td>
                                    <td>{rec.timeCollected}</td>
                                    <td>{rec.dateCollected}</td>
                                    <td>
                                        <select
                                            className={`form-select form-select-sm ${rec.session === "Charging"
                                                ? "bg-success text-white"
                                                : rec.session === "Pending"
                                                    ? "bg-warning text-dark"
                                                    : "bg-info text-dark"
                                                }`}
                                            value={rec.session}
                                            onChange={(e) => handleSessionChange(rec._id, e.target.value)}
                                            disabled={rec.session === "Collected"} // ✅ Disable if collected
                                        >
                                            {rec.session === "Pending" && (
                                                <>
                                                    <option value="Charging">Charging</option>
                                                </>
                                            )}

                                            {rec.session === "Collected" && (
                                                <option value="Collected">Collected</option>
                                            )}
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

            {/* 🌟 Pagination */}
            {totalPages > 1 && (
                <ul className="pagination justify-content-center mt-4">
                    {[...Array(totalPages)].map((_, i) => (
                        <li
                            key={i}
                            className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                        >
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Charging;
