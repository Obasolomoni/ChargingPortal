const handleSessionChange = async (id, newStatus) => {
    try {
        const res = await fetch(`https://chargingportal.onrender.com/api/charge/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session: newStatus }),
        });

        const data = await res.json();

        if (res.ok) {
            const updated = data.session;

            // Update local rows
            setRows((prev) =>
                prev.map((row) => (row._id === id ? updated : row))
            );

            toast.success(`Session changed to ${newStatus}`);
        } else {
            toast.warning(data.message || "Failed to update");
        }
    } catch (error) {
        console.error("Update error:", error);
        toast.error("Server error");
    }
};
