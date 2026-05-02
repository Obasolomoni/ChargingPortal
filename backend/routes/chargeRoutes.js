import express from "express";
import { getAllCharge, getUserName, getChargeById, postCharge, updateCharge, deleteCharge } from "../controllers/chargeControllers.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllCharge);
router.get("/username", protect, getUserName);
router.get("/:id", getChargeById);
router.post("/", protect, postCharge);
router.put("/:id", updateCharge);
router.delete("/:id", deleteCharge);

export default router;