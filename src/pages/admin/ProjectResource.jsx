import React, { useState } from "react";
import { Layout, Table, Checkbox, Button, Tag, Typography } from "antd";
import { EditOutlined, DeleteOutlined, FileTextOutlined, InfoCircleOutlined } from "@ant-design/icons";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "../../styles/ProjectResource.css";

const { Sider, Content } = Layout;

// ✅ Mock Data สำหรับตาราง (10 แถว)
const mockData = Array.from({ length: 10 }, (_, index) => ({
  key: index + 1,
  creator: index % 2 === 0 ? "นายวิทสิริ สุขหวาน" : "นายปิ๊คอัพ คนบ้านนา",
  project: "การดำเนินการติดตั้ง__________________________",
  document: "📄",
  status: index % 3 === 0 ? "gray" : index % 3 === 1 ? "blue" : "red",
  dateTime: `2017-10-31 0${index}:10:02`,
}));

// ✅ คอลัมน์ของตาราง
const columns = [
  {
    title: "เลือก",
    dataIndex: "select",
    render: () => <Checkbox />,
  },
  {
    title: "ชื่อผู้สร้าง",
    dataIndex: "creator",
  },
  {
    title: "ชื่อโครงการ",
    dataIndex: "project",
  },
  {
    title: "เอกสาร",
    dataIndex: "document",
    render: () => <FileTextOutlined style={{ fontSize: "16px", color: "#4a4a4a" }} />,
  },
  {
    title: "สถานะ",
    dataIndex: "status",
    render: (status) => <span className={`status-dot ${status}`} />,
  },
  {
    title: "วัน-เวลา",
    dataIndex: "dateTime",
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

const ProjectResource = () => {
  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      {/* Sidebar */}
      <Sider width={220} className="lg:block hidden">
        <Sidebar />
      </Sider>

      <Layout>
        {/* Header */}
        <Header title="การจัดการโครงการ" />

        {/* Content */}
        <Content className="projectResource-container">
          {/* ✅ เพิ่มหัวข้อที่ผู้ใช้ต้องการ */}
          <Typography.Text className="projectResource-title">การจัดการโครงการ</Typography.Text>

          <div className="projectResource-header">
            <Tag icon={<InfoCircleOutlined />} color="blue">texttttttttt</Tag>
            <Tag icon={<InfoCircleOutlined />} color="blue">texttttttttttttttttttttttttttttttt</Tag>
            <Tag icon={<InfoCircleOutlined />} color="blue">txt</Tag>
          </div>

          {/* Table */}
          <Table
            columns={columns}
            dataSource={mockData}
            pagination={{ pageSize: 5, showSizeChanger: false }}
            className="projectResource-table"
          />
        </Content>

        {/* ✅ Footer */}
        <Footer />
      </Layout>
    </Layout>
  );
};

export default ProjectResource;
