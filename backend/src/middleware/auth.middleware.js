import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    
    let token = req.cookies.jwt;
    
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
