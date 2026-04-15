import { useState, useEffect } from "react";
import axios from "axios";
import QRScanner from "../components/QRScanner";
import './studentdashboard.css'

const StudentDashboard = () => {
  const [form, setForm] = useState({
    sessionId: "",
    token: "",
  });

  const [showScanner, setShowScanner] = useState(false);
  const [report, setReport] = useState(null);

  // 📊 fetch report
  const fetchReport = async () => {
    const res = await axios.get(
      "http://localhost:3000/api/report/student",
      { withCredentials: true }
    );
    setReport(res.data);
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleScan = (data) => {
    setForm({
      sessionId: data.sessionId,
      token: data.token,
    });
    setShowScanner(false);
  };

  const markAttendance = async () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const latitude = pos.coords.latitude;
      const longitude = pos.coords.longitude;

      await axios.post(
        "http://localhost:3000/api/attendance/mark",
        {
          ...form,
          latitude,
          longitude,
        },
        { withCredentials: true }
      );

      alert("Attendance Marked!");
      fetchReport(); // refresh report
    });
  };

  return (
    <div className="student-dashboard-wrapper">
      <header className="student-header">
        <h2 className="student-title">My <span>Progress</span></h2>
        <p className="student-subtitle">Scan QR to mark your presence today.</p>
      </header>

      {/* 📊 REPORT SECTION */}
      {report && (
        <div className="report-container">
          <div className="report-overall-card">
            <div className="overall-info">
              <h3>Overall Attendance</h3>
              <p className="session-count">
                {report.overall.attendedSessions} of {report.overall.totalSessions} Sessions
              </p>
            </div>
            <div className="overall-percentage-circle">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="circle" strokeDasharray={`${report.overall.percentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <text x="18" y="20.35" className="percentage">{report.overall.percentage}%</text>
              </svg>
            </div>
          </div>

          <h3 className="section-title">Subject Wise</h3>
          <div className="report-subjects-grid">
            {report.subjectReport.map((sub, index) => (
              <div className="subject-card" key={index}>
                <div className="sub-top">
                  <h4 className="subject-name">{sub.subject}</h4>
                  <span className="sub-perc">{sub.percentage}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${sub.percentage}%` }}></div>
                </div>
                <p className="sub-sessions">{sub.attended} / {sub.total} attended</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🎯 FLOATING ACTION BUTTON FOR MOBILE */}
      <div className="action-area">
        <button className="scan-trigger-btn" onClick={() => setShowScanner(true)}>
          <span className="icon">📸</span> Scan New QR
        </button>
      </div>

      {/* 📷 SCANNER MODAL */}
      {showScanner && (
        <div className="scanner-overlay">
          <div className="scanner-modal">
            <button className="close-btn" onClick={() => setShowScanner(false)}>✕</button>
            <QRScanner onScan={handleScan} />
            <p className="scanner-hint">Point your camera at the teacher's QR code</p>
          </div>
        </div>
      )}

      {/* 📝 ATTENDANCE FORM SECTION */}
      {form.sessionId && (
        <div className="attendance-confirm-card">
          <h4>Confirm Attendance</h4>
          <div className="confirm-details">
            <p><strong>Session:</strong> {form.sessionId.slice(-6)}</p>
            <p><strong>Token:</strong> Secured</p>
          </div>
          <button className="mark-btn" onClick={markAttendance}>
            Confirm & Mark Present
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;