<<<<<<< HEAD
import { useState } from "react";
import { Input, Button, Form } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "../styles/Login.css";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      console.log("Login Data:", values);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* รูปโปรไฟล์ */}
        <div className="avatar"></div>

        {/* หัวข้อ */}
        <h2 className="title">Sign in</h2>
        <p className="subtitle">Welcome Back</p>

        {/* ฟอร์ม Login */}
        <Form layout="vertical" onFinish={onFinish} className="login-form">
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email Address" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          {/* ปุ่ม Login */}
          <Button
            type="primary"
            htmlType="submit"
            className="login-button"
            loading={loading}
          >
            Login
          </Button>

          {/* ปุ่ม Cancel */}
          <Button className="cancel-button">Cancel</Button>
        </Form>

        {/* ลิงก์ Forgot & Register */}
        <div className="footer-links">
          <a href="#">Forgot Password</a>
          <a href="#">Register</a>
        </div>
      </div>
=======
import React from "react";
import { Card, Typography, Input, Button } from "antd";
import { MailOutlined, LockFilled } from "@ant-design/icons";
import "../styles/Login.css"; 

const { Title, Text } = Typography;

const Login = () => {
  return (
    <div className="login-container">
      <Card className="login-card">
        {/* โลโก้ */}
        <img 
          src="Logo.png"
          alt="Logo"
          className="login-logo"
        />
        
        {/* หัวข้อ */}
        <Title level={3} className="Txtsing">Sign in</Title>
        <Text className="login-subtitle">ระบบบริหารจัดการโครงการ</Text>

        {/* Input Email */}
        <Input 
          className="email-input"
          size="large"
          placeholder="Email Address"
          prefix={<MailOutlined />}
        />

        {/* Input Password */}
        <Input.Password 
          className="password-input"
          size="large"
          placeholder="Password"
          prefix={<LockFilled />}
        />

        {/* ปุ่ม Login */}
        <Button className="login-button" type="primary" size="large">Login</Button>

        {/* ปุ่ม Cancel */}
        <Button className="cancel-button" type="text" size="large">Cancel</Button>
      </Card>
>>>>>>> main
    </div>
  );
};

export default Login;
