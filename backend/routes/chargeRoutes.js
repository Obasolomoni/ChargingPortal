import express from "express";
import { getAllCharge, getAllChargeById, postCharge, updateCharge, deleteCharge } from "../controllers/chargeControllers.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllCharge);
router.get("/:id", getAllChargeById);
router.post("/", postCharge);
router.put("/:id", updateCharge);
router.delete("/:id", deleteCharge);

export default router;