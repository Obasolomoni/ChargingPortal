import charge from "../models/chargeModels.js";

// Get all sessions
export const getAllCharge = async (req, res) => {
  try {
    const charges = await charge.find().sort({ _id: -1 });
    res.json(charges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get by ID
export const getAllChargeById = async (req, res) => {
  try {
    const charges = await charge.findById(req.params.id);
    if (!charges) return res.status(404).json({ message: "Session not found" });
    res.json(charges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new session
import charge from "../models/chargeModels.js";

export const postCharge = async (req, res) => {
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
};

// Update
export const updateCharge = async (req, res) => {
  try {
    const updatedCharge = await charge.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "charges updated", session: updatedCharge });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
export const deleteCharge = async (req, res) => {
  try {
    await charge.findByIdAndDelete(req.params.id);
    res.json({ message: "charge deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

