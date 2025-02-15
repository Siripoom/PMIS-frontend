import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login"; // นำเข้าไฟล์ Login

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="Login" element={<Login />} /> {/* หน้า Login */}
      </Routes>
    </Router>
  );
};

export default App;
