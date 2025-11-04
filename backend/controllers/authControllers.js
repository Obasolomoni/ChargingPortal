import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Users from "../models/Users.js";

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

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(201).json({ message: "Registered successfully", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { userName, userPassword } = req.body;

  try {
    const user = await Users.findOne({ userName });
    if (!user) return res.status(400).json({ message: "Invalid username" });

    const valid = await bcrypt.compare(userPassword, user.userPassword);
    if (!valid) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
