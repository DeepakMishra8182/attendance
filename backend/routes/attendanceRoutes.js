import express from "express";
import { markAttendance } from "../controllers/attendanceController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 only student can mark attendance
router.post(
  "/mark",
  protect,
  authorizeRoles("student"),
  markAttendance
);

export default router;