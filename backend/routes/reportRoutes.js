import express from "express";
import {
  getStudentReport,
  getClassReport,
  getSessionAttendance,
  getClassSubjectReport,
  getStudentFullReport
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

router.get(
  "/session/:sessionId",
  protect,
  authorizeRoles("teacher", "admin"),
  getSessionAttendance
);
router.get(
  "/class/:classId/subject/:subject",
  protect,
  authorizeRoles("admin"),
  getClassSubjectReport
);

router.get(
  "/student/:studentId",
  protect,
  authorizeRoles("admin"),
  getStudentFullReport
);

export default router;