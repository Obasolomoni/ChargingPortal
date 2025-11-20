const handleSessionChange = async (id, newStatus) => {
  try {
    const res = await fetch(`https://chargingportal.onrender.com/api/charge/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session: newStatus,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setRows((prev) =>
        prev.map((row) =>
          row._id === id
            ? {
                ...row,
                session: newStatus,

                ...(newStatus === "Charging" && {
                  timeCharged: new Date().toLocaleTimeString("en-NG", {
                    timeZone: "Africa/Lagos",
                  }),
                  dateCharged: new Date().toLocaleDateString("en-NG", {
                    timeZone: "Africa/Lagos",
                  }),
                  timeCollected: "",
                  dateCollected: "",
                }),

                ...(newStatus === "Collected" && {
                  timeCollected: new Date().toLocaleTimeString("en-NG", {
                    timeZone: "Africa/Lagos",
                  }),
                  dateCollected: new Date().toLocaleDateString("en-NG", {
                    timeZone: "Africa/Lagos",
                  }),
                }),
              }
            : row
        )
      );

      toast.success(`Session changed to ${newStatus}`);
    } else {
      toast.warning(data.message || "Failed to update session");
    }
  } catch (error) {
    console.error("Error updating session:", error);
    toast.error("Server error");
  }
};
