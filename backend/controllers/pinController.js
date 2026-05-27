const {generate} = require("raidmaker");
import charge from "../models/chargeModels.js";

export const pinCreates = async (req, res) => {
  try {
    // 🔥 Generate 6-digit pin
    const pins = generate(1, { no: 6, mode: "figs" });

    const assignedPin = pins[0]; // take one pin

    if (!assignedPin) {
      return res.status(400).json({ message: "Failed to generate pin" });
    }

    // 🔥 Create session with pin
    const newSession = new charge({
      ...req.body,
      sessionPins: assignedPin
    });

    await newSession.save();

    // 🔥 Send pin back to frontend
    res.status(201).json({
      message: "Session created successfully",
      assignedPin,
      session: newSession
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};