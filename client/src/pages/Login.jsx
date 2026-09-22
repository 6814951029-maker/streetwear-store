import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/auth";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate(data.user.role === "admin" ? "/admin" : "/");
    } catch (submitError) {
      setError(submitError.message || "ไม่สามารถเข้าสู่ระบบได้");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">STREETWEAR STORE</p>
        <h1>เข้าสู่ระบบ</h1>
        <p className="auth-subtitle">กลับมาเลือกไอเท็มที่ใช่สำหรับคุณ</p>
        {error && <p className="error-message" role="alert">{error}</p>}
        <label htmlFor="email">อีเมล</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="email" />
        <label htmlFor="password">รหัสผ่าน</label>
        <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required autoComplete="current-password" />
        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
        <p className="switch-auth">ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิก</Link></p>
      </form>
    </main>
  );
}
