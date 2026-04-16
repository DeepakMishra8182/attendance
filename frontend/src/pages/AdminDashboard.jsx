import { useState, useEffect } from "react";
import axios from "axios";
import "./admindashboard.css";

const AdminDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);

  const [className, setClassName] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [view, setView] = useState("classes");

  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [subjectName, setSubjectName] = useState("");

  // 🔥 fetch data
  const fetchAll = async () => {
    const classRes = await axios.get("http://localhost:3000/api/admin/classes", { withCredentials: true });
    const userRes = await axios.get("http://localhost:3000/api/admin/users", { withCredentials: true });

    setClasses(classRes.data);
    setUsers(userRes.data);

    if (selectedClass) {
      const updated = classRes.data.find(c => c._id === selectedClass._id);
      setSelectedClass(updated);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // ✅ create class
  const createClass = async () => {
    await axios.post("http://localhost:3000/api/admin/class",
      { className },
      { withCredentials: true }
    );
    setClassName("");
    fetchAll();
  };

  // ✅ add student
  const addStudent = async () => {
    await axios.post("http://localhost:3000/api/admin/add-student",
      { classId: selectedClass._id, studentId: selectedStudent },
      { withCredentials: true }
    );
    setSelectedStudent("");
    fetchAll();
  };

  // ✅ add subject + teacher
  const addSubject = async () => {
    await axios.post("http://localhost:3000/api/admin/add-subject",
      {
        classId: selectedClass._id,
        subjectName,
        teacherId: selectedTeacher,
      },
      { withCredentials: true }
    );
    setSubjectName("");
    setSelectedTeacher("");
    fetchAll();
  };

  return (
    <div className="admin-wrapper">
      <h2>Admin Panel</h2>

      {/* CLASS LIST */}
      {view === "classes" && (
        <>
          <input
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Class Name"
          />
          <button onClick={createClass}>Create Class</button>

          <div className="class-grid">
            {classes.map((c) => (
              <div key={c._id} className="class-box"
                onClick={() => { setSelectedClass(c); setView("class"); }}>
                <h3>{c.className}</h3>
                <p>{c.students.length} Students</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* CLASS DETAIL */}
      {view === "class" && selectedClass && (
        <div>
          <button onClick={() => setView("classes")}>⬅ Back</button>

          <h3>{selectedClass.className}</h3>

          {/* 🔵 ADD STUDENT */}
          <h4>Add Student</h4>
          <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
            <option>Select Student</option>
            {users.filter(u => u.role === "student").map(u => (
              <option key={u._id} value={u._id}>{u.name}</option>
            ))}
          </select>
          <button onClick={addStudent}>Add Student</button>

          {/* 🟣 ADD SUBJECT */}
          <h4>Add Subject</h4>
          <input
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            placeholder="Subject Name"
          />

          <select value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)}>
            <option>Select Teacher</option>
            {users.filter(u => u.role === "teacher").map(u => (
              <option key={u._id} value={u._id}>{u.name}</option>
            ))}
          </select>

          <button onClick={addSubject}>Add Subject</button>

          {/* LIST */}
          <h4>Students</h4>
          {selectedClass.students.map(s => (
            <div key={s._id}>{s.name}</div>
          ))}

          <h4>Subjects</h4>
          {selectedClass.subjects.map((sub, i) => (
            <div key={i}>
              {sub.name} - {sub.teacherId?.name || "No Teacher"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;