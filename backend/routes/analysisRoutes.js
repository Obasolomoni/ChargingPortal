import express from "express";
import { getDashboardStats, getchargingStats } from "../controllers/analysisController.js";

const router = express.Router();
router.get("/stats", getDashboardStats);
router.get("/chargeStats", getchargingStats);

export default router;