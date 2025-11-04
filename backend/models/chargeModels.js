import mongoose from "mongoose";

const chargeSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    mobileName: { type: String, required: true },
    userNumber: { type: String, required: true },
    slotName: { type: String, required: true },
    session: { type: String, required: true },
    dateCharged: { type: String, default: () => new Date().toLocaleDateString() },
    timeCharged: { type: String, default: () => new Date().toLocaleTimeString() },
    dateCollected: { type: String, default: "" },
    timeCollected: { type: String, default: "" },
  },
  { timestamps: true }
);

const charge = mongoose.model("charge", chargeSchema);
export default charge;
