import jwt from "jsonwebtoken";
import Users from "../models/Users.js";

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ FIXED: use req.user
    req.user = await Users.findById(decoded.id).select("-userPassword");

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token or unauthorized" });
  }
};

export default protect;