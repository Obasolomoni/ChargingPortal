import express from "express";
import { pinCreates } from "../controllers/pinController.js";

const router = express.Router();

router.post("/", pinCreates);

export default router;