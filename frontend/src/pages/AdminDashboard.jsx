import { useState, useEffect } from "react";
import axios from "axios";
import './admindashboard.css'

const AdminDashboard = () => {
  const [className, setClassName] = useState("");
  const [classes, setClasses] = useState([]);
  const [teacherId, setTeacherId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const fetchClasses = async () => {
    const res = await axios.get("http://localhost:3000/api/admin/classes", {
      withCredentials: true,
    });
    setClasses(res.data);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const createClass = async () => {
    await axios.post(
      "http://localhost:3000/api/admin/class",
      { className },
      { withCredentials: true }
    );
    setClassName("");
    fetchClasses();
  };

  const assignTeacher = async () => {
    await axios.post(
      "http://localhost:3000/api/admin/assign-teacher",
      { classId: selectedClass, teacherId },
      { withCredentials: true }
    );
    fetchClasses();
  };

  const addStudent = async () => {
    await axios.post(
      "http://localhost:3000/api/admin/add-student",
      { classId: selectedClass, studentId },
      { withCredentials: true }
    );
    fetchClasses();
  };
return (
    <div className="admin-container">
      <header className="admin-header">
        <h2 className="admin-title">Admin <span>Dashboard</span></h2>
        <p className="admin-subtitle">Manage your classes, teachers, and students efficiently.</p>
      </header>

      <div className="admin-grid">
        {/* Section 1: Create Class */}
        <div className="admin-card action-card">
          <h3>Create New Class</h3>
          <div className="input-group">
            <input
              className="admin-input"
              placeholder="e.g. Computer Science 101"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
            <button className="admin-button primary" onClick={createClass}>
              Create Class
            </button>
          </div>
        </div>

        {/* Section 2: Management */}
        <div className="admin-card action-card">
          <h3>Class Management</h3>
          <div className="input-row">
            <input className="admin-input" placeholder="Class ID" onChange={(e)=>setSelectedClass(e.target.value)} />
            <input className="admin-input" placeholder="Teacher/Student ID" onChange={(e)=>setTeacherId(e.target.value) || setStudentId(e.target.value)} />
          </div>
          <div className="button-row">
            <button className="admin-button secondary" onClick={assignTeacher}>Assign Teacher</button>
            <button className="admin-button success" onClick={addStudent}>Add Student</button>
          </div>
        </div>
      </div>

      <h3 className="section-heading">Active Classes</h3>
      <div className="admin-class-list">
        {classes.map((cls) => (
          <div className="admin-class-card" key={cls._id}>
            <div className="class-info">
              <h3>{cls.className}</h3>
              <span className="class-id">ID: {cls._id.slice(-6)}</span>
            </div>
            <div className="class-stats">
              <div className="stat">
                <span className="label">Teacher</span>
                <span className="value">{cls.teacherId?.name || "Not Assigned"}</span>
              </div>
              <div className="stat">
                <span className="label">Students</span>
                <span className="value">{cls.students.length} Enrolled</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;