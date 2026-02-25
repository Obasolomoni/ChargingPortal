import jwt from "jsonwebtoken";
import Users from "../models/Users.js";

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check if token exists in header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]; // Extract token
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find user attached to token
    req.Users = await Users.findById(decoded.id).select("-password");

    next(); // Allow to continue
  } catch (error) {
    return res.status(401).json({ message: "Invalid token or unauthorized" });
  }
};

export default protect;
