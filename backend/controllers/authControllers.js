import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Users from "../models/Users.js";

// REGISTER
export const registerUser = async (req, res) => {
  const { userName, userEmail, userPassword } = req.body;

  try {
    const existing = await Users.findOne({ userEmail });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userPassword, salt);

    const newUser = await Users.create({
      userName,
      userEmail,
      userPassword: hashedPassword,
    });

    // ✅ FIXED: correct variable
    const token = jwt.sign(
      { id: newUser._id, userName: newUser.userName },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({ message: "Registered successfully", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  const { userName, userPassword } = req.body;

  try {
    const user = await Users.findOne({ userName });
    if (!user) return res.status(400).json({ message: "Invalid username" });

    const valid = await bcrypt.compare(userPassword, user.userPassword);
    if (!valid) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, userName: user.userName },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET CURRENT USERNAME
export const getUserName = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json({
      username: req.user.userName
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};