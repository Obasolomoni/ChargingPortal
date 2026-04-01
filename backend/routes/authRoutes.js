import express from "express";
import { registerUser, loginUser, getUserName } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", getUserName)

export default router;
