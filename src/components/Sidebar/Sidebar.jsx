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
import "./Sidebar.css";
import logo from "../../../public/Logo.png";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="PMIS Logo" className="logo-icon" />
        <h2 className="logo-text">PMIS</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink
          to="/admin/dashboard"
          activeClassName="active"
          className="nav-item"
        >
          <DashboardOutlined /> <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/admin/project-management"
          activeClassName="active"
          className="nav-item"
        >
          <EditOutlined /> <span>Project Management</span>
        </NavLink>
        <NavLink
          to="/admin/project-progress"
          activeClassName="active"
          className="nav-item"
        >
          <TableOutlined /> <span>Project Progress</span>
        </NavLink>
        <NavLink
          to="/admin/resource-management"
          activeClassName="active"
          className="nav-item"
        >
          <FileTextOutlined /> <span>Resource Management</span>
        </NavLink>
        <NavLink
          to="/admin/budget"
          activeClassName="active"
          className="nav-item"
        >
          <CheckCircleOutlined /> <span>Budget</span>
        </NavLink>
        <NavLink
          to="/admin/report"
          activeClassName="active"
          className="nav-item"
        >
          <ExclamationCircleOutlined /> <span>Report</span>
        </NavLink>
        {/* <NavLink
          to="/admin/notification"
          activeClassName="active"
          className="nav-item"
        >
          <BellOutlined /> <span>Notification</span>
        </NavLink> */}
        <NavLink
          to="/admin/user-management"
          activeClassName="active"
          className="nav-item"
        >
          <UserOutlined /> <span>User Management</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
