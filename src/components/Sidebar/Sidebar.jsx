import { NavLink } from "react-router-dom";
import {
  DashboardOutlined,
  EditOutlined,
  TableOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  BellOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import "./Sidebar.css";
import logo from "../../../public/Logo.png";
import { jwtDecode } from "jwt-decode";

const Sidebar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); // ดึง token จาก localStorage

    if (token) {
      try {
        const decodedToken = jwtDecode(token); // ถอดรหัส token
        setUser(decodedToken); // ตั้งค่าผู้ใช้
        console.log(decodedToken);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="PMIS Logo" className="logo-icon" />
        <h2 className="logo-text">PMIS</h2>
      </div>
      <nav className="sidebar-nav">
        {/* เมนูสำหรับ Admin */}
        {user && user.role === 'admin' && (
          <>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <DashboardOutlined /> <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/admin/project-management"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <EditOutlined /> <span>Project</span>
            </NavLink>
            <NavLink
              to="/admin/project-progress"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <TableOutlined /> <span>Progress</span>
            </NavLink>
            <NavLink
              to="/admin/resource-management"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <FileTextOutlined /> <span>Resource</span>
            </NavLink>
            <NavLink
              to="/admin/budget"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <CheckCircleOutlined /> <span>Budget</span>
            </NavLink>
            {/* <NavLink
              to="/admin/report"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <ExclamationCircleOutlined /> <span>Report</span>
            </NavLink> */}
            <NavLink
              to="/admin/notification"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <BellOutlined /> <span>Notification</span>
            </NavLink>
            <NavLink
              to="/admin/user-management"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <UserOutlined /> <span>User</span>
            </NavLink>
          </>
        )}

        {/* เมนูสำหรับ Manager */}
        {user && user.role === 'manager' && (
          <>
            <NavLink
              to="/manager/dashboard"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <DashboardOutlined /> <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/admin/project-management"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <EditOutlined /> <span>Project Management</span>
            </NavLink>
            <NavLink
              to="/admin/project-progress"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <TableOutlined /> <span>Project Progress</span>
            </NavLink>
            <NavLink
              to="/admin/resource-management"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <FileTextOutlined /> <span>Resource Management</span>
            </NavLink>
            <NavLink
              to="/admin/budget"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <CheckCircleOutlined /> <span>Budget</span>
            </NavLink>
            <NavLink
              to="/admin/report"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <ExclamationCircleOutlined /> <span>Report</span>
            </NavLink>
            <NavLink
              to="/admin/notification"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <BellOutlined /> <span>Notification</span>
            </NavLink>
          </>
        )}

        {/* เมนูสำหรับ User */}
        {user && user.role === 'user' && (
          <>
            <NavLink
              to="/user/dashboard"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <DashboardOutlined /> <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/admin/project-management"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <EditOutlined /> <span>Project Management</span>
            </NavLink>
            <NavLink
              to="/admin/project-progress"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <TableOutlined /> <span>Project Progress</span>
            </NavLink>
            <NavLink
              to="/admin/resource-management"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <FileTextOutlined /> <span>Resource Management</span>
            </NavLink>
            <NavLink
              to="/admin/budget"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <CheckCircleOutlined /> <span>Budget</span>
            </NavLink>
            <NavLink
              to="/admin/report"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <ExclamationCircleOutlined /> <span>Report</span>
            </NavLink>
            <NavLink
              to="/admin/notification"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <BellOutlined /> <span>Notification</span>
            </NavLink>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
