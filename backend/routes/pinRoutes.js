import express from "express";
import { pinCreates } from "../controllers/pinController.js";

const router = express.Router();

router.get("/pins", pinCreates);

export default router;