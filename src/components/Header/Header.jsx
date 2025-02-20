import { Avatar, Dropdown, Menu, Input, Breadcrumb, Badge } from "antd";
import {
  HomeOutlined,
  SearchOutlined,
  UserOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Header.css";

const Header = ({ title }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [notifications, setNotifications] = useState(3); // จำลองจำนวนแจ้งเตือน

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (token && username) {
      setUser(username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
    navigate("/");
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="dashboard-header">
      <div className="header-left">
        {/* ชื่อหน้าขนาดใหญ่ */}
        <h2 className="page-title">{title}</h2>

        {/* Breadcrumb */}
        <Breadcrumb className="breadcrumb">
          <Breadcrumb.Item>
            <Link to="/admin/dashboard">
              <HomeOutlined />
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{title}</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="header-center">
        <Input
          className="search-bar"
          placeholder="Search"
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      <div className="header-right">
        {/* ไอคอนแจ้งเตือน */}
        <div className="notification-icon">
          <BellOutlined />
        </div>

        {/* โปรไฟล์ผู้ใช้ */}
        <Dropdown overlay={menu} trigger={["click"]}>
          <div className="user-info">
            <Avatar icon={<UserOutlined />} />
            <div className="user-details">
              <span className="user-name">{user}</span>
            </div>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
