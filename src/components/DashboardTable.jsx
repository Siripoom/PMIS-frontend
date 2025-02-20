import React from "react";
import { Card } from "antd";
import "../components/DashboardTable.css";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

// ข้อมูลสถานะของโครงการ (ข้อมูลจะถูกใช้ใน Pie Chart เท่านั้น)
const data = [
  { name: "Completed", value: 53 },
  { name: "In Progress", value: 21 },
  { name: "Pending", value: 17 },
  { name: "On Hold", value: 9 }
];

// กำหนดสีให้กับแต่ละส่วนของกราฟ
const COLORS = ["#0088FE", "#FF0000", "#00C49F", "#A8A8A8"];

const DashboardTable = () => {
  return (
    <div className="dashboard-layout">
      <div className="centered-box">
        <h2 className="font-title">ข้อมูลด้านบริหารจัดการโครงการ</h2>
        <div className="button-row">
          {[...Array(12)].map((_, index) => (
            <Card key={index} className="dashboard-card">
              <button className="dashboard-button">Button</button>
            </Card>
          ))}
        </div>
      </div>
      <div className="status-box">
        <h2 className="title-box">สถานะโครงการ</h2>
        <div className="status-info">
          <div className="pie-chart-text">
            {/* กราฟ Pie Chart */}
            <div className="pie-chart-container">
              <PieChart width={300} height={300}>
                <Pie
                  data={data}
                  cx="50%" // ตำแหน่งแนวนอนของวงกลม
                  cy="50%" // ตำแหน่งแนวตั้งของวงกลม
                  outerRadius={100} // รัศมีของวงกลม
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>

            {/* ตารางสถานะอยู่ขวาของกราฟ */}
            <div className="status-text">
              <table className="status-tb">
                <thead>
                  <tr>
                    <th>สถานะ</th>
                    <th>เปอร์เซ็นต์</th>
                    <th>จำนวน</th>
                  </tr>
                </thead>
                <tbody>
                  {/* ใส่ข้อมูลในตารางที่ต้องการ */}
                  <tr>
                    <td>กําลังดําเนินการ</td>
                    <td>53%</td>
                    <td>27 โครงการ</td>
                  </tr>
                  <tr>
                    <td>วางแผนไว้</td>
                    <td>21%</td>
                    <td>10 โครงการ</td>
                  </tr>
                  <tr>
                    <td>เสร็จสิ้น</td>
                    <td>17%</td>
                    <td>5 โครงการ</td>
                  </tr>
                  <tr>
                    <td>ล่าช้า</td>
                    <td>9%</td>
                    <td>8 โครงการ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTable;
