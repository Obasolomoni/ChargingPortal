import express from "express";
import {
  getAllCharge,
  getChargeById,
  createCharge,
  updateCharge,
  deleteCharge
} from "../controllers/chargeControllers.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllCharge);
router.get("/:id", getChargeById);

// 🔥 SINGLE CLEAN ROUTE
router.post("/", protect, createCharge);

router.put("/:id", updateCharge);
router.delete("/:id", deleteCharge);

export default router;