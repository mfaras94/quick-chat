import express from "express";
import {
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  authRateLimiter,
  updateProfileRateLimiter,
} from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.post("/signup", authRateLimiter, signup);
router.post("/login", authRateLimiter, login);
router.post("/logout", authRateLimiter, logout);

router.use(protectRoute);

router.put("/update-profile", updateProfileRateLimiter, updateProfile);
router.get("/verify", (req, res) => res.status(200).json(req.user));

export default router;
