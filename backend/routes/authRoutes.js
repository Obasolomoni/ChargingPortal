import express from "express";
import { registerUser, loginUser, getUserName } from "../controllers/authControllers.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ FIXED: add this route
router.get("/user", protect, getUserName);

export default router;