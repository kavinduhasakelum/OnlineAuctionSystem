import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await api.post("/usersapi/login", {
      email: formData.email,
      password: formData.password,
    });

    console.log("✅ Login success:", response.data);

    const { token, user } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // Redirect based on role
    if (user.role === "Buyer") {
      navigate("/buyer/home");
    } else if (user.role === "Seller") {
      navigate("/seller/home");
    } else if (user.role === "Admin") {
      navigate("/admin/home");
    } else {
      navigate("/");
    }
  } catch (error) {
    console.error("❌ Login failed:", error.response?.data || error.message);
    alert(error.response?.data?.message || "Invalid credentials!");
  }
};

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-header bg-primary text-white text-center">
              <h3 className="mb-0">Login to Your Account</h3>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-bold">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-bold">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>

                <div className="d-grid mb-3">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Sign In
                  </button>
                </div>

                <div className="text-center">
                  <Link to="/forgot-password" className="text-decoration-none">
                    Forgot your password?
                  </Link>
                </div>
              </form>

              <div className="text-center mt-4">
                <p className="mb-0">Don't have an account?</p>
                <Link to="/register" className="btn btn-outline-primary mt-2">
                  Create New Account
                </Link>
              </div>

              {/* Demo Credentials */}
              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="mb-2">Demo Credentials:</h6>
                <p className="mb-1 small">Email: demo@eliteauctions.com</p>
                <p className="mb-0 small">Password: demo123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
