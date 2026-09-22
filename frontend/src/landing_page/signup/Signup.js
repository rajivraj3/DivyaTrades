import React, { useState } from "react";
import axios from "axios";

function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      if (!apiUrl) {
        throw new Error("REACT_APP_API_URL is not configured.");
      }
      const response = await axios.post(`${apiUrl}/signup`, formData);
      setMessage(response.data.message);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Signup failed. Please check your connection and try again. (${err.message || "Unknown error"})`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f4f8ff 0%, #edf5ff 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      fontFamily: "Arial, sans-serif",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "480px",
        background: "#ffffff",
        borderRadius: "20px",
        boxShadow: "0 16px 40px rgba(36, 90, 180, 0.14)",
        padding: "32px",
      }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <img
            src="/media images/logo.svg"
            alt="DivyaTrades logo"
            style={{ width: "60%", marginBottom: "10px" }}
          />
          <h2 style={{ margin: 0, color: "#1f2d3d", fontSize: "28px" }}>Create your account</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#2d3a4b" }}>
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#2d3a4b" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#2d3a4b" }}>
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#2d3a4b" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#2d3a4b" }}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              style={inputStyle}
              required
            />
          </div>

          {message && (
            <div style={{ marginBottom: "16px", padding: "10px 12px", borderRadius: "8px", background: "#e8f7ee", color: "#1b6d4b", fontSize: "14px" }}>
              {message}
            </div>
          )}

          {error && (
            <div style={{ marginBottom: "16px", padding: "10px 12px", borderRadius: "8px", background: "#fdecea", color: "#b42318", fontSize: "14px" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              border: "none",
              background: "linear-gradient(135deg, #387ed1, #2a64b8)",
              color: "#fff",
              fontSize: "16px",
              fontWeight: 700,
              padding: "14px",
              borderRadius: "10px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  border: "1px solid #d8e1ee",
  borderRadius: "10px",
  padding: "12px 14px",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
  background: "#f9fbff",
};

export default Signup;
