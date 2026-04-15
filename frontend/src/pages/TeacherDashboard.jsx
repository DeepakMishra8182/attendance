import { useState, useEffect } from "react";
import axios from "axios";
import "./teacherdashboard.css";

const TeacherDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  const [form, setForm] = useState({
    classId: "",
    subject: "",
  });

  const [qr, setQr] = useState(null);

  // 🔥 fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      const res = await axios.get(
        "http://localhost:3000/api/admin/classes",
        { withCredentials: true }
      );

      setClasses(res.data);

      // 🔥 filter classes where teacher is assigned
      const teacherId = res.data[0]?.teacherId?._id; // fallback
      const userRes = await axios.get(
        "http://localhost:3000/api/auth/me",
        { withCredentials: true }
      );

      const userId = userRes.data._id;

      const filtered = res.data.filter((cls) =>
        cls.subjects?.some(
          (sub) => sub.teacherId === userId
        )
      );

      setFilteredClasses(filtered);
    };

    fetchClasses();
  }, []);

  // 🔥 when class changes
  const handleClassChange = (classId) => {
    const cls = filteredClasses.find((c) => c._id === classId);

    setSelectedClass(cls);

    setForm({
      classId,
      subject: "",
    });
  };

  // 🔥 generate QR
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
  };

  return (
    <div className="teacher-wrapper">
      <header className="teacher-header">
        <h2 className="teacher-title">
          Lecture <span>Session</span>
        </h2>
        <p className="teacher-subtitle">
          Select your assigned class and subject to generate attendance QR
        </p>
      </header>

      <div className="teacher-grid">
        {/* 🔧 CONTROL PANEL */}
        <div className="teacher-card control-panel">
          <h3>Session Details</h3>

          {/* CLASS SELECT */}
          <div className="t-input-group">
            <label>Choose Class</label>
            <select
              className="teacher-select"
              onChange={(e) => handleClassChange(e.target.value)}
            >
              <option value="">-- Select Class --</option>
              {filteredClasses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.className}
                </option>
              ))}
            </select>
          </div>

          {/* SUBJECT SELECT */}
          <div className="t-input-group">
            <label>Subject</label>
            <select
              className="teacher-select"
              value={form.subject}
              onChange={(e) =>
                setForm({ ...form, subject: e.target.value })
              }
            >
              <option value="">-- Select Subject --</option>

              {selectedClass?.subjects
                ?.filter(
                  (sub) =>
                    sub.teacherId ===
                    selectedClass?.subjects.find(
                      (s) => s.name === sub.name
                    )?.teacherId
                )
                .map((sub, index) => (
                  <option key={index} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
            </select>
          </div>

          <button className="teacher-button" onClick={generateQR}>
            ⚡ Generate QR Code
          </button>
        </div>

        {/* 📱 QR PANEL */}
        <div
          className={`teacher-card qr-display-panel ${
            qr ? "qr-active" : ""
          }`}
        >
          {!qr ? (
            <div className="qr-placeholder">
              <div className="qr-skeleton"></div>
              <p>QR Code will appear here</p>
            </div>
          ) : (
            <div className="qr-result-container">
              <div className="qr-frame">
                <img src={qr} alt="QR" className="qr-image" />
              </div>
              <p className="qr-timer">Valid for limited time</p>
              <button
                className="print-btn"
                onClick={() => window.print()}
              >
                Print QR
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;