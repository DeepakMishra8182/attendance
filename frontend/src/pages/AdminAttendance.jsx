import { useState, useEffect } from "react";
import axios from "axios";

const AdminAttendance = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [attendance, setAttendance] = useState([]);

  // 🔥 fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      const res = await axios.get(
        "http://localhost:3000/api/admin/classes",
        { withCredentials: true }
      );
      setClasses(res.data);
    };

    fetchClasses();
  }, []);

  // 🔥 fetch sessions (by class + subject)
  const fetchSessions = async (classId, subject) => {
    const res = await axios.get(
      `http://localhost:3000/api/session?classId=${classId}&subject=${subject}`,
      { withCredentials: true }
    );
    setSessions(res.data);
  };

  // 🔥 fetch attendance
  const fetchAttendance = async (sessionId) => {
    const res = await axios.get(
      `http://localhost:3000/api/report/session/${sessionId}`,
      { withCredentials: true }
    );
    setAttendance(res.data);
  };

  return (
    <div className="admin-attendance-container">
      <h2>Admin Attendance Panel</h2>

      {/* CLASS */}
      <select
        onChange={(e) => {
          const cls = classes.find((c) => c._id === e.target.value);
          setSelectedClass(cls);
          setSelectedSubject("");
          setSessions([]);
          setAttendance([]);
        }}
      >
        <option>Select Class</option>
        {classes.map((c) => (
          <option key={c._id} value={c._id}>
            {c.className}
          </option>
        ))}
      </select>

      {/* SUBJECT */}
      {selectedClass && (
        <select
          onChange={(e) => {
            setSelectedSubject(e.target.value);
            fetchSessions(selectedClass._id, e.target.value);
          }}
        >
          <option>Select Subject</option>
          {selectedClass.subjects?.map((sub, i) => (
            <option key={i} value={sub.name}>
              {sub.name}
            </option>
          ))}
        </select>
      )}

      {/* SESSION */}
      {sessions.length > 0 && (
        <select
          onChange={(e) => {
            setSelectedSession(e.target.value);
            fetchAttendance(e.target.value);
          }}
        >
          <option>Select Session</option>
          {sessions.map((s) => (
            <option key={s._id} value={s.sessionId}>
              {new Date(s.createdAt).toLocaleString()}
            </option>
          ))}
        </select>
      )}

      {/* ATTENDANCE */}
      <div className="attendance-list">
        {attendance.length === 0 ? (
          <p>No attendance data</p>
        ) : (
          attendance.map((item) => (
            <div key={item._id} className="attendance-card">
              {item.studentId.name} ({item.studentId.email})
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminAttendance;