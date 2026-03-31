import mongoose from "mongoose";

const chargeSchema = new mongoose.Schema({
  personName: { type: String, required: true },
  mobileName: { type: String, required: true },
  userNumber: { type: String, required: true },
  slotName: { type: String, required: true },
  session: { type: String, required: true },

  dateCharged: { type: String, default: "" },
  timeCharged: { type: String, default: "" },

  dateCollected: { type: String, default: "" },
  timeCollected: { type: String, default: "" },

  sessionPins: {type: String, required: true}
});

export default mongoose.model("charge", chargeSchema);
