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


export const createCharge = async (req, res) => {
  try {
    // 🔥 Generate PIN
 const generatePin = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
    const assignedPin = generatePins();

    console.log(assignedPin)

    if (!assignedPin) {
      return res.status(400).json({ message: "Failed to generate pin" });
    }

    // 🔥 Get time/date
    const { date, time } = nowLagos();

    // 🔥 Create FULL session (everything merged)
    const newSession = new charge({
      ...req.body,

      // ✅ from JWT
      registrar: req.user?.userName || "Unknown",

      // ✅ generated pin
      sessionPins: assignedPin,

      // ✅ conditional time/date
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
    console.error("CREATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE SESSION (e.g. Charging → Collected)
export const updateCharge = async (req, res) => {
  try {
    const { session } = req.body;
    const { date, time } = nowLagos();

    const updateData = {session}
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
    
    if(session === "Collected") {
      updateData.dateCollected = date;
      updateData.timeCollected = time;

      // 🔥 FREE THE PIN

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