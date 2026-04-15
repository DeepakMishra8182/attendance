import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: { type: String, required: true },

    token: { type: String, required: true },

    startTime: { type: Date, default: Date.now },
    expiryTime: { type: Date, required: true },

    latitude: Number,
    longitude: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Session", sessionSchema);