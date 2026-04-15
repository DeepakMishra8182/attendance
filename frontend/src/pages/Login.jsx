import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import './login.css'

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { fetchUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await axios.post(
        "http://localhost:3000/api/auth/login",
        form,
        { withCredentials: true }
      );

      const user = await fetchUser();

      // 🔥 role-based redirect
      if (user?.role === "admin") navigate("/admin");
      else if (user?.role === "teacher") navigate("/teacher");
      else navigate("/student");

    } catch (err) {
      setError("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-visual">
          {/* Ye side panel design ke liye hai */}
          <h2>Welcome Back!</h2>
          <p>Login to track your attendance and stay updated.</p>
          <div className="auth-circle-1"></div>
          <div className="auth-circle-2"></div>
        </div>

        <form className="auth-form" onSubmit={submitHandler}>
          <div className="form-header">
            <h2 className="auth-title">Account Login</h2>
            <p>Please enter your credentials</p>
          </div>

          {error && (
            <div className="error-box">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="input-group">
            <input
              className="auth-input"
              type="email"
              name="email"
              placeholder=" " /* Empty placeholder for CSS focus logic */
              onChange={handleChange}
              required
            />
            <label className="auth-label">Email Address</label>
          </div>

          <div className="input-group">
            <input
              className="auth-input"
              type="password"
              name="password"
              placeholder=" "
              onChange={handleChange}
              required
            />
            <label className="auth-label">Password</label>
          </div>

          <button className={`auth-button ${loading ? 'btn-loading' : ''}`} disabled={loading}>
            {loading ? (
              <span className="loader"></span>
            ) : (
              "Login to Dashboard"
            )}
          </button>

          <p className="auth-footer">
            Don't have an account? <span onClick={() => navigate('/register')}>Sign Up</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;