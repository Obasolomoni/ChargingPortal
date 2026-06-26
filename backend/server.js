import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import chargeRoutes from "./routes/chargeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import analysisRoutes from "./routes/analysisRoutes.js"
import connectDB from "./models/db.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 2000;

// CORS FIX
app.use(
  cors({
    origin: [
      "https://charging-portal.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/dashboard", analysisRoutes);
app.use("/api/charge", chargeRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT ${PORT}`);
});
