import React from "react";
import { Button } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import "../components/DashboardTable.css"; // นำเข้าไฟล์ CSS

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <div className="centered-box">
        <h2 className="dashboard-title">ข้อมูลด้านบริหารจัดการโครงการ</h2>
        <div className="button-row">
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
