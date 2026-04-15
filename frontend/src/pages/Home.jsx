import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import './home.css'

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-wrapper">
      {/* 🚀 HERO SECTION */}
      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Smart <span>QR Attendance</span> System
          </h1>
          <p className="hero-description">
            A secure, efficient, and real-time attendance tracking solution built on the MERN stack. 
            Eliminate manual entry and embrace the future of classroom management.
          </p>
          
          {!user ? (
            <div className="hero-btns">
              <Link to="/login" className="btn-primary">Get Started</Link>
              <Link to="/register" className="btn-secondary">Join as Student</Link>
            </div>
          ) : (
            <div className="user-welcome-card">
              <h3>Welcome back, <span>{user.name}</span>!</h3>
              <p>Role: {user.role.toUpperCase()}</p>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn-primary">
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* 📊 STATS SECTION */}
      <section className="stats-container">
        <div className="stat-card"><h3>Admin</h3><p>Full System Control</p></div>
        <div className="stat-card"><h3>Teacher</h3><p>Dynamic QR Generation</p></div>
        <div className="stat-card"><h3>Student</h3><p>One-Tap Attendance</p></div>
      </section>

      {/* ✨ FEATURES SECTION */}
      <section className="features-section">
        <h2 className="section-label">System Highlights</h2>
        <div className="features-grid">
          <div className="f-card">
            <div className="f-icon">🔒</div>
            <h4>Secure Validation</h4>
            <p>Expiry mechanisms, duplicate prevention, and geolocation checks for fair attendance.</p>
          </div>
          <div className="f-card">
            <div className="f-icon">⚡</div>
            <h4>Real-time Tracking</h4>
            <p>Mark attendance instantly and see it reflected in your history immediately.</p>
          </div>
          <div className="f-card">
            <div className="f-icon">📈</div>
            <h4>Deep Analytics</h4>
            <p>Subject-wise reports and attendance percentage calculations for teachers & students.</p>
          </div>
          <div className="f-card">
            <div className="f-icon">📱</div>
            <h4>Dynamic QR</h4>
            <p>Unique session IDs and time-restricted codes for every single lecture.</p>
          </div>
        </div>
      </section>

      {/* 📝 ABOUT SECTION */}
      <section className="about-project">
        <div className="about-content">
          <h2>About the Project</h2>
          <p>
            The QR Code Attendance System automates the process of marking attendance in a secure 
            and efficient way. Using role-based access control, the system ensures that only 
            authorized users perform specific actions. From managing class-wise participation 
            to tracking individual performance, we maintain complete data integrity.
          </p>
        </div>
      </section>

      <footer className="home-footer">
        <p>&copy; 2026 QR Attendance System | Powered by MERN Stack</p>
      </footer>
    </div>
  );
};

export default Home;