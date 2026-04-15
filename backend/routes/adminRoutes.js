import express from "express";
import {
  createClass,
  assignTeacher,
  addStudentToClass,
  getAllClasses,
  addSubjectToClass
} from "../controllers/adminController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 Only Admin Routes
router.post("/class", protect, authorizeRoles("admin"), createClass);
router.post("/assign-teacher", protect, authorizeRoles("admin"), assignTeacher);
router.post("/add-student", protect, authorizeRoles("admin"), addStudentToClass);
router.get("/classes", protect, authorizeRoles("admin"), getAllClasses);
router.post("/add-subject", protect, authorizeRoles("admin"), addSubjectToClass);

export default router;