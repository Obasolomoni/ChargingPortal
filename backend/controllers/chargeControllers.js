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
export const postCharge = async (req, res) => {
  try {
    const newcharges = new charge(req.body);
    await newcharges.save();
    res.status(201).json({ message: "Session created successfully", session: newcharges });
  } catch (err) {
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

