import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";
import cookie from "cookie";

// Socket.IO auth middleware
// Runs before connection is accepted
const socketAuthMiddleware = async (socket, next) => {
  try {
    //  Read raw Cookie header from socket handshake
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    // Get JWT from cookie
    const token = cookies.jwt;
    //  If token missing, reject socket connection
  
    if (!token) {
      console.log("Socket connection rejected: No token provided");
      return next(new Error("Unauthorized - No Token Provided"));
    }
    //  Verify JWT signature and decode payload
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) {
      console.log("Socket connection rejected: Invalid token");
      return next(new Error("Unauthorized - Invalid Token"));
    }
    // Find user in DB from decoded token payload
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("Socket connection rejected: User not found");
      return next(new Error("User not found"));
    }
    //  Attach authenticated user info to socket object
    // So later socket handlers can use socket.user / socket.userId
    socket.user = user;
    socket.userId = user._id.toString();

    console.log(
      `Socket authenticated for user: ${user.fullName} (${user._id})`,
    );

    next();
  }catch (error) {
    console.log("Error in socket authentication:", error.message);
    next(new Error("Unauthorized - Authentication failed"));
  }
}

export default socketAuthMiddleware;
