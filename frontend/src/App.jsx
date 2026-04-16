import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import { AuthProvider, useAuth } from "./context/AuthContext";

import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import AdminAttendance from "./pages/AdminAttendance";

// 🔥 ROLE BASED DASHBOARD
const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (user.role === "admin") return <AdminDashboard />;
  if (user.role === "teacher") return <TeacherDashboard />;
  if (user.role === "student") return <StudentDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <div className="app-container">
          <main className="app-main-content">
            <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* 🔐 MAIN DASHBOARD ROUTE */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* OPTIONAL DIRECT ROUTES */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/teacher"
                element={
                  <ProtectedRoute>
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/student"
                element={
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/attendance"
                element={
                  <ProtectedRoute>
                    <AdminAttendance />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
