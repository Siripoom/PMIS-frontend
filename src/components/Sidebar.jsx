import { NavLink } from "react-router-dom";
import { LogoutOutlined, DashboardOutlined, EditOutlined, TableOutlined, OrderedListOutlined, CheckCircleOutlined, WarningOutlined, ProfileOutlined, UserOutlined } from "@ant-design/icons";
import "./Sidebar.css"; // นำเข้าไฟล์ CSS
import logo from "../assets/image.png";
import { useState, useEffect } from "react";

const Sidebar = () => {
  // ดึงข้อมูลชื่อผู้ใช้จากระบบ Login (ตัวอย่าง: localStorage หรือ API)
  const [username, setUsername] = useState("Guest");

  useEffect(() => {
    const storedUser = localStorage.getItem("username"); // สมมติว่าชื่อผู้ใช้ถูกเก็บใน localStorage
    if (storedUser) {
      setUsername(storedUser);
    }
  }, []);

  return (
    <div className="sidebar">
      {/* โลโก้และชื่อระบบ */}
      <div className="sidebar-header">
        <img src={logo} alt="Logo" className="logo" />
        <span className="sidebar-title">PMIS</span>
      </div>

      {/* ปุ่มเมนูหลัก */}
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="nav-item">
          <DashboardOutlined /> <span>Dashboard</span>
        </NavLink>
        <NavLink to="/project-management" className="nav-item">
          <EditOutlined /> <span>Project Management</span>
        </NavLink>
        <NavLink to="/project-progress" className="nav-item">
          <TableOutlined /> <span>Project Progress</span>
        </NavLink>
        <NavLink to="/resource-management" className="nav-item">
          <OrderedListOutlined /> <span>Resource Management</span>
        </NavLink>
        <NavLink to="/budget" className="nav-item">
          <CheckCircleOutlined /> <span>Budget</span>
        </NavLink>
        <NavLink to="/report" className="nav-item">
          <WarningOutlined /> <span>Report</span>
        </NavLink>
        <NavLink to="/notification" className="nav-item">
          <ProfileOutlined /> <span>Notification</span>
        </NavLink>
        <NavLink to="/user-management" className="nav-item">
          <UserOutlined /> <span>User Management</span>
        </NavLink>
      </nav>

      {/* ข้อมูลโปรไฟล์ผู้ใช้ (อยู่ล่างสุด) */}
      <div className="user-profile">
        <UserOutlined className="user-icon" />
        <span className="user-name">{username}</span>
      </div>

      {/* ปุ่มออกจากระบบ (อยู่ใต้ User Profile) */}
      <NavLink to="/logout" className="nav-item logout-button">
        <LogoutOutlined className="logout-icon" />
        <span>Log out</span>
      </NavLink>
    </div>
  );
};

export default Sidebar;
