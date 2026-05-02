import charge from "../models/chargeModels.js";

const nowLagos = () => {
  return {
    time: new Date().toLocaleTimeString("en-NG", { timeZone: "Africa/Lagos" }),
    date: new Date().toLocaleDateString("en-NG", { timeZone: "Africa/Lagos" }),
  };
};

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
      registrar: req.user.userName, // ✅ FIXED
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
    console.error("ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};