try {
    const { userName, mobileName, userNumber, slotName, session } = req.body;

    // ✅ 1. Check how many devices are currently charging
    const activeCharging = await charge.countDocuments({ session: "Charging" });

    // ✅ 2. If 32 or more devices are charging, override to Pending
    let finalSession = session;
    if (activeCharging >= 32) {
      finalSession = "Pending";
    }

    // ✅ 3. Prepare the new charge document
    const newCharge = new charge({
      userName,
      mobileName,
      userNumber,
      slotName,
      session: finalSession,
      dateCharged: finalSession === "Charging" ? new Date().toLocaleDateString() : "",
      timeCharged: finalSession === "Charging" ? new Date().toLocaleTimeString() : "",
      dateCollected: "",
      timeCollected: "",
    });

    // ✅ 4. Save new entry
    await newCharge.save();

    res.status(201).json({
      message:
        finalSession === "Pending"
          ? "⚠️ All slots full — device added as pending"
          : "✅ Device now charging",
      session: newCharge,
    });
  } catch (err) {
    console.error("Error creating charge:", err);
    res.status(500).json({ message: err.message });
  }
