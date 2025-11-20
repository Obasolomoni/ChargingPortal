import charge from "../models/chargeModels.js";

// Format time in Africa/Lagos
const nowLagos = () => {
  const options = {
    timeZone: "Africa/Lagos",
    hour12: true,
  };

  return {
    time: new Date().toLocaleTimeString("en-NG", options),
    date: new Date().toLocaleDateString("en-NG", { timeZone: "Africa/Lagos" }),
  };
};

// Get all sessions
export const getAllCharge = async (req, res) => {
  try {
    const charges = await charge.find().sort({ _id: -1 });
    res.json(charges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get by id
export const getChargeById = async (req, res) => {
  try {
    const charges = await charge.findById(req.params.id);
    if (!charges) return res.status(404).json({ message: "Session not found" });
    res.json(charges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new session
export const postCharge = async (req, res) => {
  try {
    const { date, time } = nowLagos();

    const newCharge = new charge({
      ...req.body,
      dateCharged: req.body.session === "Charging" ? date : "",
      timeCharged: req.body.session === "Charging" ? time : "",
    });

    await newCharge.save();
    res.status(201).json({ message: "Session created", session: newCharge });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
export const updateCharge = async (req, res) => {
  try {
    const { session } = req.body;
    const timestamps = nowLagos();

    const updateObj = { session };

    if (session === "Charging") {
      updateObj.dateCharged = timestamps.date;
      updateObj.timeCharged = timestamps.time;
      updateObj.dateCollected = "";
      updateObj.timeCollected = "";
    }

    if (session === "Collected") {
      updateObj.dateCollected = timestamps.date;
      updateObj.timeCollected = timestamps.time;
    }

    const updatedCharge = await charge.findByIdAndUpdate(
      req.params.id,
      updateObj,
      { new: true }
    );

    res.json({ message: "Session updated", session: updatedCharge });
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
