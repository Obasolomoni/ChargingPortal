import express from "express";
import { pinCreates } from "../controllers/pinController.js";

const router = express.Router();

router.get("/", pinCreates);
router.get("/", pinCreates);

export default router;