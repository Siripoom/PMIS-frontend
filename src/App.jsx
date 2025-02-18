import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login"; // นำเข้าไฟล์ Login
import { Dashboard } from "./pages/admin/Dashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="Login" element={<Login />} /> {/* หน้า Login */}
        <Route path="/Dashboard" element={<Dashboard />} /> {/* หน้า Dashboard */}
      </Routes>
    </Router>
  );
};

export default App;