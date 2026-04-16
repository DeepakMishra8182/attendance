import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./navbar.css";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          QR<span>Attendance</span>
        </div>

        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Home
          </Link>

          {!user ? (
            <div className="auth-links">
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link register-btn">
                Register
              </Link>
            </div>
          ) : (
            <div className="user-section">
              <span className="navbar-user">Hi, {user.name}</span>

              {/* 🔥 DASHBOARD LINK */}
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>

              {/* 🔥 ADMIN ONLY */}
              {user.role === "admin" && (
                <Link to="/admin/attendance" className="nav-link">
                  Attendance
                </Link>
              )}

              {/* 🔥 TEACHER ONLY */}
              {user.role === "teacher" && (
                <Link to="/teacher" className="nav-link">
                  Teacher Panel
                </Link>
              )}

              {/* 🔥 STUDENT ONLY */}
              {user.role === "student" && (
                <Link to="/student" className="nav-link">
                  Student Panel
                </Link>
              )}

              <button className="logout-btn" onClick={logoutHandler}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;