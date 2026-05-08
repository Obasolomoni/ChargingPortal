import charge from "../models/chargeModels.js";

// 🔥 Time helper
const nowLagos = () => {
  return {
    time: new Date().toLocaleTimeString("en-NG", { timeZone: "Africa/Lagos" }),
    date: new Date().toLocaleDateString("en-NG", { timeZone: "Africa/Lagos" }),
  };
};

// ✅ GET ALL SESSIONS
export const getAllCharge = async (req, res) => {
  try {
    const charges = await charge.find().sort({ _id: -1 });
    res.json(charges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET SINGLE SESSION
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
export const postCharge = async (req, res) => {
  try {
    const { date, time } = nowLagos();

    const ALL_PINS = ["Pin 1", "Pin 2", "Pin 3", "Pin 4", "Pin 5", "Pin 6"];

    const activeSessions = await charge.find({ status: "active" });

    const usedPins = activeSessions.map(s => s.sessionPins).filter(Boolean);

    const availablePins = ALL_PINS.filter(pin => !usedPins.includes(pin));

    if (availablePins.length === 0) {
      return res.status(400).json({ message: "No available pins" });
    }

    const assignedPin = availablePins[0];

    const newCharge = new charge({
      ...req.body,
      sessionPins: assignedPin,
      registrar: req.user.userName, // 🔥 from JWT
      status: "active",

      dateCharged: req.body.session === "Charging" ? date : "",
      timeCharged: req.body.session === "Charging" ? time : "",
    });

    await newCharge.save();

    res.status(201).json({
      message: "Session created",
      session: newCharge,
      assignedPin
    });

  } catch (err) {
    console.error("POST ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE SESSION (e.g. Charging → Collected)
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

    if (session === "Collected") {
      updateData.dateCollected = date;
      updateData.timeCollected = time;

      // 🔥 FREE THE PIN
      updateData.status = "inactive";
    }

    const updated = await charge.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      message: "Session updated",
      session: updated
    });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE SESSION
export const deleteCharge = async (req, res) => {
  try {
    await charge.findByIdAndDelete(req.params.id);

    res.json({ message: "Session deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};