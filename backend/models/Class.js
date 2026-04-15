import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    className: { type: String, required: true },

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    subjects: [
      {
        name: { type: String, required: true },

        teacherId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Class", classSchema);