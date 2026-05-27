import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import chargeRoutes from "./routes/chargeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import pinRoute from ".routes/pinRoutes.js"
import connectDB from "./models/db.js";

// 🔥 Force Node.js to use Lagos timezone
process.env.TZ = "Africa/Lagos";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 2000;

// CORS FIX
app.use(
  cors({
    origin: [
      "https://charging-portal.vercel.app",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/charge", chargeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/", pinRoutes)

app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT ${PORT}`);
});
