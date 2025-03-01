import { useState } from "react";
import { Card, Typography, Input, Button, message } from "antd";
import { MailOutlined, LockFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth"; // ✅ ใช้ API login
import "../styles/Login.css";

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("🔄 Sending login request...");

    try {
      // ✅ ส่ง email และ password ไปยัง API
      const response = await login({ email, password });

      console.log("✅ Login Response:", response); // ✅ Debug Response

      // ✅ ตรวจสอบว่า API ตอบ `token` และ `user` มาหรือไม่
      if (response?.token) {
        const userRole = response.user?.role || "user"; // ✅ ถ้าไม่มี role ให้เป็น "user"
        const userName = response.user?.name || "Unknown"; // ✅ ถ้าไม่มี name ให้เป็น "Unknown"

        localStorage.setItem("token", response.token);
        localStorage.setItem("role", userRole);
        localStorage.setItem("name", userName);

        message.success(`Welcome, ${userName}!`);

        // ✅ นำทางไป Dashboard
        navigate("/admin/dashboard");
      } else {
        throw new Error("Invalid login response");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      message.error(error.response?.data?.message || "Login failed! Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        {/* โลโก้ */}
        <img src="/Logo.png" alt="Logo" className="login-logo" />

        {/* หัวข้อ */}
        <Title level={3} className="Txtsing">Sign in</Title>
        <Text className="login-subtitle">ระบบบริหารจัดการโครงการ</Text>

        {/* Input Email */}
        <Input
          className="email-input"
          size="large"
          placeholder="Email Address"
          prefix={<MailOutlined />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Input Password */}
        <Input.Password
          className="password-input"
          size="large"
          placeholder="Password"
          prefix={<LockFilled />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ปุ่ม Login */}
        <Button
          className="login-button"
          type="primary"
          size="large"
          onClick={handleLogin}
          loading={loading}
        >
          Login
        </Button>

        {/* ปุ่ม Cancel */}
        <Button
          className="cancel-button"
          type="text"
          size="large"
          onClick={() => {
            setEmail("");
            setPassword("");
          }}
        >
          Cancel
        </Button>
      </Card>
    </div>
  );
};

export default Login;
