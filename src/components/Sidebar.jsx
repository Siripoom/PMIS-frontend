import { NavLink } from "react-router-dom";
import {
  HomeOutlined,
  CloudOutlined,
  FileTextOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import "./Sidebar.css";

const Sidebar = () => {
  const [isStationOpen, setIsStationOpen] = useState(true); // ให้เปิด dropdown ไว้โดย default

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2 className="logo-text">ระบบระบายน้ำ สำนักช่าง</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="nav-item" activeClassName="active">
          <HomeOutlined /> <span>หน้าหลัก</span>
        </NavLink>

        {/* Dropdown: สถานีระบายน้ำ */}
        <div
          className={`nav-item dropdown ${isStationOpen ? "open" : ""}`}
          onClick={() => setIsStationOpen(!isStationOpen)}
        >
          <CloudOutlined /> <span>สถานีระบายน้ำ</span> <DownOutlined />
        </div>
        {isStationOpen && (
          <div className="dropdown-menu">
            <NavLink to="/admin/station/info" className="nav-sub-item">
              <span>ข้อมูลสถานีระบายน้ำ</span>
            </NavLink>
            <NavLink to="/station/history" className="nav-sub-item">
              <span>ประวัติการเปลี่ยนแปลง</span>
            </NavLink>
          </div>
        )}
      </nav>

      {/* ปุ่มออกจากระบบ */}
      <NavLink to="/logout" className="logout-button">
        <span>ออกจากระบบ</span>
      </NavLink>
    </div>
  );
};

export default Sidebar;
