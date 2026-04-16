import Session from "../models/Session.js";
import Attendance from "../models/Attendance.js";
import { io } from "../server.js";

// 📍 Distance function (Haversine)
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // km
};

// ✅ MARK ATTENDANCE
export const markAttendance = async (req, res) => {
  try {
    const { sessionId, token, latitude, longitude } = req.body;

    // 🔍 find session
    const session = await Session.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // 🔐 token validation
    if (session.token !== token) {
      return res.status(400).json({ message: "Invalid QR" });
    }

    // ⏰ expiry check
    if (Date.now() > new Date(session.expiryTime)) {
      return res.status(400).json({ message: "QR Expired" });
    }

    // ⏳ late entry check (5 min)
    const allowedTime =
      new Date(session.startTime).getTime() + 5 * 60 * 1000;

    if (Date.now() > allowedTime) {
      return res.status(400).json({ message: "Too late" });
    }

    // 🔥 CLASS VALIDATION (VERY IMPORTANT)
    if (
      req.user.classId?.toString() !== session.classId.toString()
    ) {
      return res
        .status(403)
        .json({ message: "You are not in this class" });
    }

    // 📍 location check (optional safety)
    if (
      session.latitude &&
      session.longitude &&
      latitude &&
      longitude
    ) {
      const distance = getDistance(
        latitude,
        longitude,
        session.latitude,
        session.longitude
      );

      if (distance > 0.1) {
        return res
          .status(400)
          .json({ message: "Outside classroom" });
      }
    }

    // 🔁 duplicate check
    const already = await Attendance.findOne({
      studentId: req.user._id,
      sessionId,
    });

    if (already) {
      return res.status(400).json({ message: "Already marked" });
    }

    // ✅ save attendance
    const attendance = await Attendance.create({
      studentId: req.user._id,
      sessionId,
      classId: session.classId,
      subject: session.subject,
    });

    // 🔥 REAL-TIME EVENT
    io.emit("attendanceMarked", {
      studentId: req.user._id,
      sessionId,
      subject: session.subject,
    });

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already marked" });
    }

    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};