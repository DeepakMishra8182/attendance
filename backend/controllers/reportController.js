import Attendance from "../models/Attendance.js";
import Session from "../models/Session.js";

// ✅ STUDENT REPORT (class-wise + subject-wise)
export const getStudentReport = async (req, res) => {
  try {
    const studentId = req.user._id;

    // total sessions (class-wise)
    const totalSessions = await Session.countDocuments({
      classId: req.user.classId,
    });

    const attendedSessions = await Attendance.countDocuments({
      studentId,
    });

    const overallPercentage =
      totalSessions === 0
        ? 0
        : ((attendedSessions / totalSessions) * 100).toFixed(2);

    // 📊 subject-wise
    const subjectStats = await Attendance.aggregate([
      { $match: { studentId } },
      {
        $group: {
          _id: "$subject",
          attended: { $sum: 1 },
        },
      },
    ]);

    const subjectReport = [];

    for (let sub of subjectStats) {
      const total = await Session.countDocuments({
        subject: sub._id,
        classId: req.user.classId,
      });

      subjectReport.push({
        subject: sub._id,
        attended: sub.attended,
        total,
        percentage:
          total === 0
            ? 0
            : ((sub.attended / total) * 100).toFixed(2),
      });
    }

    res.json({
      overall: {
        totalSessions,
        attendedSessions,
        percentage: overallPercentage,
      },
      subjectReport,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ TEACHER REPORT (class analytics)
export const getClassReport = async (req, res) => {
  try {
    const { classId } = req.params;

    const sessions = await Session.find({ classId });

    const studentsAttendance = await Attendance.aggregate([
      {
        $match: { classId: sessions[0]?.classId },
      },
      {
        $group: {
          _id: "$studentId",
          attended: { $sum: 1 },
        },
      },
    ]);

    const totalSessions = sessions.length;

    const report = studentsAttendance.map((s) => ({
      studentId: s._id,
      attended: s.attended,
      total: totalSessions,
      percentage:
        totalSessions === 0
          ? 0
          : ((s.attended / totalSessions) * 100).toFixed(2),
    }));

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getSessionAttendance = async (req, res) => {
  const { sessionId } = req.params;

  const data = await Attendance.find({ sessionId })
    .populate("studentId", "name email");

  res.json(data);
};

export const getClassSubjectReport = async (req, res) => {
  const { classId, subject } = req.params;

  // get all students of class
  const classData = await Class.findById(classId).populate(
    "students",
    "name email"
  );

  const students = classData.students;

  // total sessions of this subject
  const totalSessions = await Session.countDocuments({
    classId,
    subject,
  });

  const result = [];

  for (let student of students) {
    const attended = await Attendance.countDocuments({
      studentId: student._id,
      classId,
      subject,
    });

    result.push({
      name: student.name,
      email: student.email,
      attended,
      total: totalSessions,
      percentage:
        totalSessions === 0
          ? 0
          : ((attended / totalSessions) * 100).toFixed(2),
    });
  }

  res.json(result);
};

export const getStudentFullReport = async (req, res) => {
  const { studentId } = req.params;

  const data = await Attendance.aggregate([
    { $match: { studentId: new mongoose.Types.ObjectId(studentId) } },
    {
      $group: {
        _id: "$subject",
        attended: { $sum: 1 },
      },
    },
  ]);

  res.json(
    data.map((d) => ({
      subject: d._id,
      percentage: d.attended,
    }))
  );
};