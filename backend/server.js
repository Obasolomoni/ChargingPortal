import express from "express";
import dotenv from "dotenv";
import cors  from "cors";
import chargeRoutes from "./routes/chargeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./models/db.js";


dotenv.config();
connectDB();

const PORT = 2000

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/charge", chargeRoutes);
app.use("/api/auth", authRoutes);
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`))