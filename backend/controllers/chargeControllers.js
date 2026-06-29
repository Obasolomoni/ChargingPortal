import * as raidmaker from "raidmaker";

const generator = raidmaker.default.default;

const pin = generator.generate(6, {
  mode: "figs",
  no: 1,
});


import charge from "../models/chargeModels.js";
import {nowLagos} from "../utils/dateandtime.js"

// 🔥 PIN generator (NO LIBRARY)
// const generatePin = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// ✅ GET ALL
export const getAllCharge = async (req, res) => {
  try {
    const charges = await charge.find().sort({ _id: -1 });
    res.json(charges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET ONE
export const getChargeById = async (req, res) => {
  try {
    const single = await charge.findById(req.params.id);

    if (!single) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(single);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ CREATE SESSION (MAIN LOGIC)
export const createCharge = async (req, res) => {
  try {
    console.log("Incoming body:", req.body);

    // const assignedPin = generatePin(); // 🔥 always works
    const assignedPin = pin();


    const { date, time } = nowLagos();

    const newSession = new charge({
      ...req.body,
      registrar: req.user?.userName || "Guest",
      sessionPins: assignedPin,
      dateCharged: req.body.session === "Charging" ? date : "",
      timeCharged: req.body.session === "Charging" ? time : "",
    });

    await newSession.save();

    res.status(201).json({
      message: "Session created successfully",
      assignedPin,
      session: newSession,
    });

  } catch (err) {
    console.error("🔥 ERROR:", err);

    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// ✅ UPDATE
export const updateCharge = async (req, res) => {
  try {
    const { session } = req.body;
    const { date, time } = nowLagos();

    const updateData = { session };

    if (session === "Charging") {
      updateData.dateCharged = date;
      updateData.timeCharged = time;
      updateData.dateCollected = "";
      updateData.timeCollected = "";
    }

    if (session === "Pending") {
      updateData.dateCharged = "";
      updateData.timeCharged = "";
      updateData.dateCollected = "";
      updateData.timeCollected = "";
    }

    if (session === "Collected") {
      updateData.dateCollected = date;
      updateData.timeCollected = time;
    }

    const updated = await charge.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      message: "Session updated",
      session: updated,
    });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE
export const deleteCharge = async (req, res) => {
  try {
    await charge.findByIdAndDelete(req.params.id);
    res.json({ message: "Session deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};