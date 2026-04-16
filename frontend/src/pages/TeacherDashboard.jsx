import { useState, useEffect } from "react";
import axios from "axios";
import "./teacherdashboard.css";

const TeacherDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    classId: "",
    subject: "",
  });

  const [qr, setQr] = useState(null);
  const [sessionId, setSessionId] = useState("");
  const [attendanceList, setAttendanceList] = useState([]);

  // 🔥 Fetch user + classes
  useEffect(() => {
    const fetchData = async () => {
      const userRes = await axios.get(
        "http://localhost:3000/api/auth/me",
        { withCredentials: true }
      );

      setUser(userRes.data);

      const res = await axios.get(
        "http://localhost:3000/api/admin/classes",
        { withCredentials: true }
      );

      setClasses(res.data);

      // filter only teacher classes
      const filtered = res.data.filter((cls) =>
        cls.subjects?.some(
          (sub) => sub.teacherId?._id === userRes.data._id
        )
      );

      setFilteredClasses(filtered);
    };

    fetchData();
  }, []);

  // 🔥 Handle class change
  const handleClassChange = (classId) => {
    const cls = filteredClasses.find((c) => c._id === classId);
    setSelectedClass(cls);

    setForm({
      classId,
      subject: "",
    });
  };

  // 🔥 Generate QR + session
  const generateQR = async () => {
  if (!form.classId || !form.subject) {
    alert("Select class and subject");
    return;
  }

  const res = await axios.post(
    "http://localhost:3000/api/session/create",
    form,
    { withCredentials: true }
  );

  setQr(res.data.qrImage);
  setSessionId(res.data.session.sessionId);

  // 🔥 YAHI PAR LAGANA HAI
  setTimeout(() => {
    setQr(null);
    setSessionId("");
    setAttendanceList([]); // optional cleanup
  }, 10 * 60 * 1000);
};

  // 🔥 Fetch attendance
  const fetchAttendance = async () => {
    if (!sessionId) return;

    const res = await axios.get(
      `http://localhost:3000/api/report/session/${sessionId}`,
      { withCredentials: true }
    );

    setAttendanceList(res.data);
  };

  // 🔥 Auto refresh (every 3 sec)
  useEffect(() => {
    if (!sessionId) return;

    const interval = setInterval(() => {
      fetchAttendance();
    }, 3000);

    return () => clearInterval(interval);
  }, [sessionId]);

  return (
    <div className="teacher-wrapper">
      <h2 className="teacher-title">Teacher Dashboard</h2>

      {/* CLASS SELECT */}
      <select
        className="teacher-select"
        onChange={(e) => handleClassChange(e.target.value)}
      >
        <option value="">Select Class</option>
        {filteredClasses.map((c) => (
          <option key={c._id} value={c._id}>
            {c.className}
          </option>
        ))}
      </select>

      {/* SUBJECT SELECT */}
      <select
        className="teacher-select"
        value={form.subject}
        onChange={(e) =>
          setForm({ ...form, subject: e.target.value })
        }
      >
        <option value="">Select Subject</option>

        {selectedClass?.subjects
          ?.filter((sub) => sub.teacherId?._id === user?._id)
          .map((sub, i) => (
            <option key={i} value={sub.name}>
              {sub.name}
            </option>
          ))}
      </select>

      {/* BUTTON */}
      <button className="teacher-button" onClick={generateQR}>
        Generate QR
      </button>

      {/* QR */}
      {qr && (
        <div className="qr-section">
          <img src={qr} alt="QR" className="qr-image" />
          <p>Session ID: {sessionId}</p>
        </div>
      )}

      {/* 🔥 ATTENDANCE LIST */}
      {sessionId && (
        <div className="attendance-section">
          <h3>Present Students</h3>

          {attendanceList.length === 0 ? (
            <p>No students yet</p>
          ) : (
            attendanceList.map((item) => (
              <div key={item._id} className="attendance-card">
                {item.studentId.name} ({item.studentId.email})
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;