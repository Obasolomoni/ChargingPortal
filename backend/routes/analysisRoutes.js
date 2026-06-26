import express from "express";
import { getDashboardStats, chargingStats } from "../controllers/analysisController.js";

const router = express.Router();
router.get("/stats", getDashboardStats);
router.get("/chargeStats", chargingStats);

export default router;