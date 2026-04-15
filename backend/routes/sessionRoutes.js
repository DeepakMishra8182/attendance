import express from "express";
import { createSession } from "../controllers/sessionController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 Only teacher can generate QR
router.post(
  "/create",
  protect,
  authorizeRoles("teacher"),
  createSession
);

export default router;