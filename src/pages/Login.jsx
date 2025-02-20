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
    </div>
  );
};

export default Login;
