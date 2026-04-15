import Session from "../models/Session.js";
import Class from "../models/Class.js";
import crypto from "crypto";
import QRCode from "qrcode";

// ✅ CREATE SESSION + QR
export const createSession = async (req, res) => {
  const { classId, subject, latitude, longitude } = req.body;

  // 🔍 Get class
  const classData = await Class.findById(classId);

  if (!classData) {
    return res.status(404).json({ message: "Class not found" });
  }

  // 🔐 Check teacher assigned to subject
  const subjectData = classData.subjects.find(
    (sub) =>
      sub.name === subject &&
      sub.teacherId.toString() === req.user._id.toString()
  );

  if (!subjectData) {
    return res.status(403).json({
      message: "You are not assigned to this subject",
    });
  }

  // 🔐 Generate secure values
  const sessionId = crypto.randomBytes(8).toString("hex");
  const token = crypto.randomBytes(16).toString("hex");

  const startTime = Date.now();
  const expiryTime = new Date(startTime + 10 * 60 * 1000);

  const session = await Session.create({
    sessionId,
    classId,
    teacherId: req.user._id,
    subject,
    token,
    startTime,
    expiryTime,
    latitude,
    longitude,
  });

  const qrData = JSON.stringify({ sessionId, token });
  const qrImage = await QRCode.toDataURL(qrData);

  res.status(201).json({
    message: "Session created",
    qrImage,
    session,
  });
};