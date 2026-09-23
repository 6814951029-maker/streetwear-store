import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "/api/auth";
const initialForm = { username: "", email: "", password: "", fullName: "", phone: "" };

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
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
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "สมัครสมาชิกไม่สำเร็จ");
      }

      navigate("/login", { state: { message: "สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ" } });
    } catch (submitError) {
      setError(submitError.message || "ไม่สามารถสมัครสมาชิกได้");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">STREETWEAR STORE</p>
        <h1>สมัครสมาชิก</h1>
        <p className="auth-subtitle">สร้างบัญชีเพื่อเริ่มช้อปไอเท็มชิ้นโปรด</p>
        {error && <p className="error-message" role="alert">{error}</p>}
        <label htmlFor="username">ชื่อผู้ใช้</label>
        <input id="username" name="username" value={form.username} onChange={handleChange} required autoComplete="username" />
        <label htmlFor="email">อีเมล</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="email" />
        <label htmlFor="password">รหัสผ่าน</label>
        <input id="password" name="password" type="password" minLength="6" value={form.password} onChange={handleChange} required autoComplete="new-password" />
        <label htmlFor="fullName">ชื่อ-นามสกุล</label>
        <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} autoComplete="name" />
        <label htmlFor="phone">เบอร์โทรศัพท์</label>
        <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} autoComplete="tel" />
        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
        </button>
        <p className="switch-auth">มีบัญชีอยู่แล้ว? <Link to="/login">เข้าสู่ระบบ</Link></p>
      </form>
    </main>
  );
}
