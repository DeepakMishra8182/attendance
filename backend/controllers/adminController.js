import User from "../models/User.js";
import Class from "../models/Class.js";

// ✅ CREATE CLASS
export const createClass = async (req, res) => {
  const { className } = req.body;

  const existingClass = await Class.findOne({ className });
  if (existingClass) {
    return res.status(400).json({ message: "Class already exists" });
  }

  const newClass = await Class.create({ className });

  res.status(201).json(newClass);
};

// ✅ ASSIGN TEACHER TO CLASS
export const assignTeacher = async (req, res) => {
  const { classId, teacherId } = req.body;

  const teacher = await User.findById(teacherId);
  if (!teacher || teacher.role !== "teacher") {
    return res.status(400).json({ message: "Invalid teacher" });
  }

  const updatedClass = await Class.findByIdAndUpdate(
    classId,
    { teacherId },
    { new: true }
  );

  res.json(updatedClass);
};

// ✅ ADD STUDENT TO CLASS
export const addStudentToClass = async (req, res) => {
  const { classId, studentId } = req.body;

  const student = await User.findById(studentId);
  if (!student || student.role !== "student") {
    return res.status(400).json({ message: "Invalid student" });
  }

  const updatedClass = await Class.findByIdAndUpdate(
    classId,
    { $addToSet: { students: studentId } }, // prevent duplicate
    { new: true }
  );

  // also update student's classId
  student.classId = classId;
  await student.save();

  res.json(updatedClass);
};

// ✅ GET ALL CLASSES
export const getAllClasses = async (req, res) => {
  const classes = await Class.find()
    .populate("students", "name email")
    .populate("subjects.teacherId", "name email");

  res.json(classes);
};
export const addSubjectToClass = async (req, res) => {
  const { classId, subjectName, teacherId } = req.body;

  const updatedClass = await Class.findByIdAndUpdate(
    classId,
    {
      $push: {
        subjects: {
          name: subjectName,
          teacherId,
        },
      },
    },
    { new: true }
  );

  res.json(updatedClass);
};