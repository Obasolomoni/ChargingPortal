import express from "express";
import { registerUser, loginUser, getUserName } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/userName", getUserName)

export default router;
