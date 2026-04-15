import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './register.css'

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://localhost:3000/api/auth/register",
      form,
      { withCredentials: true }
    );

    navigate("/login");
  };
return (
    <div className="register-wrapper">
      <div className="register-card">
        <div className="register-info">
          <h2>Join the Future</h2>
          <p>Create an account to start tracking attendance with just a scan.</p>
          <ul className="info-list">
            <li>✅ Instant QR Scanning</li>
            <li>✅ Real-time Analytics</li>
            <li>✅ Secure Role Access</li>
          </ul>
        </div>

        <form className="register-form" onSubmit={submitHandler}>
          <div className="register-header">
            <h2 className="register-title">Create Account</h2>
            <p>Enter your details below</p>
          </div>

          <div className="reg-input-group">
            <input className="reg-input" name="name" placeholder=" " onChange={handleChange} required />
            <label className="reg-label">Full Name</label>
          </div>

          <div className="reg-input-group">
            <input className="reg-input" name="email" type="email" placeholder=" " onChange={handleChange} required />
            <label className="reg-label">Email Address</label>
          </div>

          <div className="reg-input-group">
            <input className="reg-input" name="password" type="password" placeholder=" " onChange={handleChange} required />
            <label className="reg-label">Password</label>
          </div>

          <div className="reg-input-group">
            <select className="reg-select" name="role" onChange={handleChange}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
            <label className="reg-label-select">Select Role</label>
          </div>

          <button className="reg-button">Register Now</button>
          
          <p className="reg-footer">
            Already have an account? <span onClick={() => navigate('/login')}>Login</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;