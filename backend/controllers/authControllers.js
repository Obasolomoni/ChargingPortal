import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Users from "../models/Users.js";

// 🔐 Generate Token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      userName: user.userName
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// =======================
// 🟢 REGISTER
// =======================
export const registerUser = async (req, res) => {
  const { userName, userEmail, userPassword } = req.body;

  try {
    // Check if user exists
    const existing = await Users.findOne({ userEmail });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    // Create user
    const newUser = await Users.create({
      userName,
      userEmail,
      userPassword: hashedPassword
    });

    // Generate token
    const token = generateToken(newUser);

    // Send response
    res.status(201).json({
      message: "Registered successfully",
      token,
      userName: newUser.userName
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// =======================
// 🔵 LOGIN
// =======================
export const loginUser = async (req, res) => {
  const { userName, userPassword } = req.body;

  try {
    const user = await Users.findOne({ userName });

    if (!user) {
      return res.status(400).json({ message: "Invalid username" });
    }

    const isMatch = await bcrypt.compare(userPassword, user.userPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      userName: user.userName
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getUser = async (req, res) => {
    try {
      const users = await Users.find()
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}