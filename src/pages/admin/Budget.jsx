import React from "react";
import { Layout, Button, Input, Card } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { List } from "antd";

import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import "../../styles/Budget.css";
import Footer from "../../components/Footer/Footer";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const { Sider, Content } = Layout;
//Mock data ของโครงการต่างๆ
const projectData = [
  { title: "โครงการดำเนินการติดตั้ง", time: "07:00 AM" },
  { title: "โครงการดำเนินการติดตั้ง", time: "Yesterday, 04:00 PM" },
  { title: "โครงการดำเนินการติดตั้ง", time: "August 1st 2022" },
  { title: "โครงการดำเนินการติดตั้ง", time: "August 1st 2022" },
  { title: "โครงการดำเนินการติดตั้ง", time: "August 1st 2022" },
  { title: "โครงการดำเนินการติดตั้ง", time: "August 1st 2022" },
];

const Budget = () => {     
  // ข้อมูลสำหรับกราฟแท่ง
  const labels = ["โครงการ 1", "โครงการ 2", "โครงการ 3", "โครงการ 4", "โครงการ 5", "โครงการ 6", "โครงการ 7", "โครงการ 8", "โครงการ 9", "โครงการ 10"];
  const data = {
    labels,
    datasets: [
      
      {
        label: "งบประมาณที่ใช้ไป",
        data: [2052310, 1500000, 1200000, 1800000, 2500000, 3000000, 2200000, 2700000, 2900000, 3100000],
        backgroundColor: "#FF4D4F",
      },
      {
        label: "งบประมาณคงเหลือ",
        data: [552312, 2500000, 1800000, 1200000, 3000000, 4000000, 3500000, 3700000, 3900000, 4100000],
        backgroundColor: "#52C41A",
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            weight: "bold",
          },
          color: "#555",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 12,
          },
          color: "#555",
        },
        grid: {
          color: "#ccc",
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
          color: "#555",
        },
        grid: {
          display: false,
        },
      },
    },
  };

  //กราฟเส้น
  const lineData = {
    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October"],
    datasets: [
      {
        label: "งบประมาณคงเหลือ",
        data: [1000000, 1700000, 1500000, 1600000, 2100000, 2500000, 2300000, 2600000, 2800000, 1000],
        borderColor: "#52C41A",
        backgroundColor: "rgba(24, 144, 255, 0.2)",
        tension: 0.4,
      },
      {
        label: "งบประมาณที่ใช้ไป",
        data: [500000, 800000, 700000, 900000, 1200000, 1400000, 1100000, 1500000, 1700000, 2000000],
        borderColor: "#722ED1", // สีม่วง
        backgroundColor: "rgba(114, 46, 209, 0.2)",
        tension: 0.4,
      }
    ],
  };
  

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      <Sider width={220} className="lg:block hidden">
        <Sidebar />
      </Sider>
      <Layout>
        <Header title="Budget" />
        <Content className="budget-container">
          <div className="budget-card-container">
            <div className="budget-header">
              <h2 className="budget-title">ภาพรวมงบประมาณโครงการ</h2>
            </div>
            <div className="budget-actions">
              <Button type="default" icon={<PlusOutlined />} className="budget-expense-button">
                บันทึกค่าใช้จ่าย
              </Button>
              <Button type="primary" className="budget-save-button">
                บันทึก
              </Button>
            </div>
            <div className="budget-summary">
              <Card className="budget-card budget-used">
                <p>งบประมาณที่ใช้ไป</p>
                <h3>2,689,598.00 บาท</h3>
              </Card>
              <Card className="budget-card budget-remaining">
                <p>งบประมาณคงเหลือ</p>
                <h3>1,600,261.00 บาท</h3>
              </Card>
            </div>
            <div className="budget-total-wrapper">
              <Card className="budget-card budget-total">
                <p>งบประมาณทั้งหมด</p>
                <h3>4,289,859.00 บาท</h3>
              </Card>
            </div>
            <div className="budget-search-container">
              <Input
                placeholder="Search"
                prefix={<SearchOutlined />}
                className="budget-search-input"
              />
            </div>
          </div>
        </Content>
        <Content className="budget-chart-wrapper">
          <Card className="budget-chart-card">  
            <p className="budget-chart-title">เปรียบเทียบบงบประมาณที่ใช้ไปและคงเหลือของแต่ละโครงการ</p>
            <Bar options={options} data={data} />
          </Card>
          <Card className="budget-linechart-card">
            <p className="budget-linechart-title">กราฟเส้นเปรียบเทียบงบประมาณ</p>
            <div style={{ width: "100%", height: "280px" }}>
              <Line options={lineOptions} data={lineData} />
            </div>
          </Card>
        </Content>
        <Content className="budget-card-row">
          <Card className="budget-card additional-info">
            <p>รายการโครงการ</p>
            <Button type="primary" shape="round" icon={<RightOutlined />} size="small" className="view-all-button">
              View All
            </Button>
            <List
              itemLayout="horizontal"
              dataSource={projectData}
              renderItem={(project) => (
                <List.Item actions={[<RightOutlined key="view" />]}>
                  <List.Item.Meta
                    title={
                      <span>
                        {project.title} <span style={{ color: "#ccc" }}> _________________ </span>
                      </span>
                    }
                    description={<span style={{ color: "#666" }}>{project.time}</span>}
                  />
                </List.Item>
              )}
            />
           
          </Card>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default Budget;