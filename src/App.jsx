import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login"; // นำเข้าไฟล์ Login
import Dashboard from "./pages/admin/Dashboard";
import ProjectManagement from "./pages/admin/ProjectManagement";
import ProjectProgress from "./pages/admin/ProjectProgress";
import ResourceManagement from "./pages/admin/ProjectResource";
import Budget from "./pages/admin/Budget";
import Report from "./pages/admin/Report";
import UserManagement from "./pages/admin/UserManagement";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={<Login />} /> {/* หน้า Login */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route
          path="/admin/project-management"
          element={<ProjectManagement />}
        />
        <Route path="/admin/project-progress" element={<ProjectProgress />} />
        <Route
          path="/admin/resource-management"
          element={<ResourceManagement />}
        />
        <Route path="/admin/budget" element={<Budget />} />
        <Route path="/admin/report" element={<Report />} />
        <Route path="/admin/user-management" element={<UserManagement />} />
      </Routes>
    </Router>
  );
};

export default App;
