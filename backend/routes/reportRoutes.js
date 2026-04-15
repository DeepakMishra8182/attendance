import express from "express";
import {
  getStudentReport,
  getClassReport,
} from "../controllers/reportController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// 👨‍🎓 Student dashboard
router.get(
  "/student",
  protect,
  authorizeRoles("student"),
  getStudentReport
);

// 👨‍🏫 Teacher dashboard
router.get(
  "/class/:classId",
  protect,
  authorizeRoles("teacher"),
  getClassReport
);

export default router;