import React, { useState } from "react";
import { Layout, Table, Checkbox, Button, Typography, Input, Dropdown, Menu } from "antd";
import { SearchOutlined, DownOutlined, FileTextOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "../../styles/ProjectResource.css";
const { Sider, Content } = Layout;

// ✅ Dropdown Component
const CategoryDropdown = ({ onSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState("หมวดหมู่");

  const handleMenuClick = (e) => {
    setSelectedCategory(e.key);
    console.log("🔹 เลือกหมวดหมู่:", e.key);
    onSelect(e.key); // ส่งค่าที่เลือกไปให้ parent component
  };
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="อุปกรณ์ IT">อุปกรณ์ IT</Menu.Item>
      <Menu.Item key="เฟอร์นิเจอร์">เฟอร์นิเจอร์</Menu.Item>
      <Menu.Item key="เครื่องมือ">เครื่องมือ</Menu.Item>
      <Menu.Item key="บุคลากร">บุคลากร</Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Button className="category-dropdown">
        {selectedCategory} <DownOutlined />
      </Button>
    </Dropdown>
  );
};

// ✅ Mock Data สำหรับตาราง (10 แถว)
const mockData = Array.from({ length: 10 }, (_, index) => ({
  key: index + 1,
  creator: index % 2 === 0 ? "เครื่องพิมพ์" : "เก้าอี้สํานักงาน",
  project: index % 4 === 0 ? "อุปกรณ์ IT"
  : index % 4 === 1 ? "เฟอร์นิเจอร์"
  : index % 4 === 2 ? "เครื่องมือ"
  : "บุคลากร",

  number: Math.floor(Math.random() * 1000) + 1, // ✅ สุ่มตัวเลขระหว่าง 1-1000
  status: index % 2 === 0 ? { text: "พร้อมใช้งาน", color: "green" } // ✅ สีเขียว
                          : { text: "กำลังใช้งาน", color: "blue" },  // 🔵 สีฟ้า

}));

// Mock dta ตาราง 2 (10 แถว)
const userNames = ["phalat01", "pickup00", "pickupza55"]; // ✅ รายชื่อผู้ใช้ที่ต้องการสุ่ม
const projectNames = [
  "โครงการติดตั้งระบบเครือข่าย",
  "โครงการปรับปรุงสำนักงาน",
  "โครงการซ่อมบำรุงเครื่องจักร",
  "โครงการพัฒนาแอปพลิเคชัน",
  "โครงการจัดซื้ออุปกรณ์สำนักงาน",
];
const mockData1 = Array.from({ length: 10 }, (_, index) => ({
  project1: projectNames[Math.floor(Math.random() * projectNames.length)], 
  history: ` ${index % 3 === 0 ? "เครื่องพิมพ์"
           : index % 3 === 1 ? "เก้าอี้สำนักงาน"
           : "ชุดเครื่องมือช่าง"}`, // ✅ แสดงข้อความ "เบิก..." ให้สอดคล้องกับข้อมูล
  username: userNames[Math.floor(Math.random() * userNames.length)], // ✅ สุ่มชื่อผู้ใช้
  category: index % 4 === 0 ? "อุปกรณ์ IT"
          : index % 4 === 1 ? "เฟอร์นิเจอร์"
          : index % 4 === 2 ? "เครื่องมือ"
          : "บุคลากร", // ✅ สุ่มหมวดหมู่
  quantity: Math.floor(Math.random() * 20) + 1, // ✅ สุ่มจำนวนระหว่าง 1-20
  status: index % 3 === 0 ? { text: "รออนุมัติ", color: "red" }
         : index % 3 === 1 ? { text: "พร้อมใช้งาน", color: "green" }
         : { text: "กำลังใช้งาน", color: "blue" }, // ✅ สุ่มสถานะ
}));


// ✅ คอลัมน์ของตาราง1
const columns = [
  {
    title: "ลำดับ",
    dataIndex: "index",
    render: (_, __, index) => index + 1, // ✅ แสดงลำดับของแถว
  },

  {
    title: "รายการทรัพยากร",
    dataIndex: "creator",
  },
  {
    title: "หมวดหมู่",
    dataIndex: "project",
  },
  {
    title: "คงเหลือ",
    dataIndex: "number",
  },
  {
    title: "สถานะ",
    dataIndex: "status",
    render: (status) => (
      <span style={{ color: status.color, fontWeight: "bold" }}>
        {status.text}
      </span>
    ), // ✅ แสดงสถานะพร้อมสี
  },
  {
    title: "จัดการ",
    render: () => (
      <div className="action-buttons">
        <Button type="link" danger icon={<DeleteOutlined />}>
          ลบ  
        </Button>
        <Button type="link" icon={<EditOutlined />}>
          แก้ไข
        </Button>
      </div>
    ),
  },
];


//คอลัมตาราง2
// ✅ คอลัมน์ของตาราง
const columns1 = [
  {
    title: "ชื่อผู้ใช้",
    dataIndex: "username",
    render: (text, record) => (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div>
          <div style={{ fontWeight: "bold" }}>{text}</div>
          <div style={{ fontSize: "12px", color: "#888" }}>{record.dateTime}</div>
        </div>
      </div>
    ),
  },
  {
    title: "โครงการ", 
    dataIndex: "project1",
  },
  {
    title: "เบิกทรัพยากร",
    dataIndex: "history", // ✅ แก้จาก resource เป็น history ให้ตรงกับ mockData1
    render: (text) => <span style={{ fontWeight: "bold", color: "red" }}>{text}</span>,
  },
  {
    title: "หมวดหมู่",
    dataIndex: "category",
    render: (text) => (
      <span style={{ color: text === "อุปกรณ์ IT" ? "red" 
                   : text === "เครื่องมือ" ? "green" 
                   : text === "เฟอร์นิเจอร์" ? "black" 
                   : "blue" }}>
        {text}
      </span>
    ),
  },
  {
    title: "จำนวน",
    dataIndex: "quantity",
    render: (text) => <span style={{ fontWeight: "bold", color: "red" }}>{text}</span>,
  },
  {
    title: "สถานะ",
    dataIndex: "status",
    render: (status) => <span style={{ color: status.color, fontWeight: "bold" }}>{status.text}</span>,
  },
];


const ProjectResource = () => {
  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      {/* Sidebar */}
      <Sider width={220} className="lg:block hidden">
        <Sidebar />
      </Sider>
      <Layout>
        {/* Header */}
        <Header title="รายการทรัพยากร" />

        {/* Content */}
        <Content className="projectResource-container">
          {/* ✅ เพิ่มหัวข้อที่ผู้ใช้ต้องการ */}
          <Typography.Text className="projectResource-title">รายการทรัพยากร</Typography.Text>

          <div className="projectResource-header">
     {/* Search */}
      <Input
        placeholder="ค้นหารายการทรัพยากร"
        prefix={<SearchOutlined style={{ color: "rgba(0,0,0,0.45)" }} />}
        className="projectResource-search"
      />
      <button type="primary" className="custom-search-button">
        ค้นหา </button>
        {/*dowpdown */}
        <CategoryDropdown onSelect={(value) => console.log("🔹 หมวดหมู่ที่เลือก:", value)} />
          {/*เบิกทรัพยากร*/}
      <Button type="primary" className="resources-button">
        เบิกทรัพยากร </Button>
          {/*เพิ่มทรัพยากร*/}
          <Button type="primary" className="add-resorces">
            เพิ่มทรัพยากร
          </Button>
      </div>
    
          {/* Table */}
          <Table
            columns={columns}
            dataSource={mockData}
            pagination={{ pageSize: 6, showSizeChanger: false }}
            className="projectResource-table"
          />

        
      </Content>
           
       {/* Table */}
       <Table
  title={() => (
    <Typography.Text strong style={{ fontSize: "16px", color: "#333" }}>
      ประวัติการเบิกทรัพยากร
    </Typography.Text>
  )}
        columns={columns1}
        dataSource={mockData1}
        pagination={{ pageSize: 5, showSizeChanger: false }}
        className="resource-table"
      />
      
        {/* ✅ Footer */}
        <Footer />
      </Layout>
    </Layout>
  );
};

export default ProjectResource;
