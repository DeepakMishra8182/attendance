import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    subject: String,
  },
  { timestamps: true }
);

// 🔒 prevent duplicate attendance
attendanceSchema.index({ studentId: 1, sessionId: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);