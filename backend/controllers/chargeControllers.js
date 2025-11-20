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
    const single = await charge.findById(req.params.id);
    if (!single) return res.status(404).json({ message: "Session not found" });
    res.json(single);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new session
export const postCharge = async (req, res) => {
  try {
    const { userName, mobileName, userNumber, slotName, session } = req.body;

    const newCharge = new charge({
      userName,
      mobileName,
      userNumber,
      slotName,
      session,
      dateCharged:
        session === "Pending"
          ? new Date().toLocaleDateString("en-NG", { timeZone: "Africa/Lagos" })
          : "",
      timeCharged:
        session === "Pending"
          ? new Date().toLocaleTimeString("en-NG", {
              timeZone: "Africa/Lagos",
            })
          : "",
      dateCollected: "",
      timeCollected: "",
    });

    await newCharge.save();

    res.status(201).json({
      message: "Session created successfully",
      session: newCharge,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
export const updateCharge = async (req, res) => {
  try {
    const { session } = req.body;

    const updateBody = {
      session,
    };

    if (session === "Charging") {
      updateBody.dateCharged = new Date().toLocaleDateString("en-NG", {
        timeZone: "Africa/Lagos",
      });
      updateBody.timeCharged = new Date().toLocaleTimeString("en-NG", {
        timeZone: "Africa/Lagos",
      });
      updateBody.dateCollected = "";
      updateBody.timeCollected = "";
    }

    if (session === "Collected") {
      updateBody.dateCollected = new Date().toLocaleDateString("en-NG", {
        timeZone: "Africa/Lagos",
      });
      updateBody.timeCollected = new Date().toLocaleTimeString("en-NG", {
        timeZone: "Africa/Lagos",
      });
    }

    const updated = await charge.findByIdAndUpdate(req.params.id, updateBody, {
      new: true,
    });

    res.json({ message: "Session updated", session: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
export const deleteCharge = async (req, res) => {
  try {
    await charge.findByIdAndDelete(req.params.id);
    res.json({ message: "Charge deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
