import { Layout, Table, Button, Dropdown, Menu, Modal, Form, Input } from "antd";
import { FilePdfOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs"; // ✅ ใช้จัดการวันที่
import "dayjs/locale/th"; // ✅ ตั้งค่าเป็นภาษาไทย
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import "../../styles/Report.css";
import Footer from "../../components/Footer/Footer";
import { useState } from "react";

const { Sider, Content } = Layout;

// 🔹 กำหนด `dayjs` ให้ใช้ภาษาไทย
dayjs.locale("th");

// 🔹 ฟังก์ชันแปลงวันที่เป็นรูปแบบไทย
const formatThaiDate = (date) => dayjs(date).format("DD MMMM YYYY HH:mm");

// 🔹 สร้าง Mock Data พร้อมงบประมาณ และวันที่
const mockData = Array.from({ length: 10 }, (_, index) => ({
  key: index + 1,
  project_name: `โครงการที่ ${index + 1}`,
  total_budget: (Math.random() * 900000 + 100000).toFixed(2), // ✅ งบประมาณรวม
  used_budget: (Math.random() * 500000).toFixed(2), // ✅ งบประมาณที่ใช้ไป
}));

const Report = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    form.resetFields(); // ✅ รีเซ็ตฟอร์มก่อนเปิด
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddReport = (values) => {
    console.log("📢 เพิ่มรายงานใหม่:", values);
    setIsModalVisible(false);
  };

  // 🔹 กำหนดคอลัมน์ของตาราง
  const columns = [
    { title: "ลำดับ", dataIndex: "key", key: "key" },
    { 
      title: "ชื่อโครงการ", 
      dataIndex: "project_name", 
      key: "project_name",
      render: (text, record) => (
        <>
          <div>{text}</div>
          <div style={{ fontSize: "12px", color: "#888" }}>
            งบประมาณรวม: {record.total_budget} บาท | ใช้ไป: {record.used_budget} บาท
          </div>
        </>
      )
    },
    { 
      title: "Show PDF", 
      key: "pdf", 
      render: () => <FilePdfOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
    },
    { 
      title: "Download", 
      key: "download", 
      render: () => (
        <Dropdown overlay={
          <Menu>
            <Menu.Item key="pdf">PDF</Menu.Item>
            <Menu.Item key="excel">Excel</Menu.Item>
          </Menu>
        }>
          <Button>Export ⬇️</Button>
        </Dropdown>
      )
    },
    { 
      title: "จัดการ", 
      key: "actions", 
      render: () => (
        <>
          <Button type="link" danger>ลบ</Button> | 
          <Button type="link">แก้ไข</Button>
        </>
      )
    }
  ];

  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      {/* Sidebar */}
      <Sider width={220} className="lg:block hidden">
        <Sidebar />
      </Sider>

      <Layout>
        <Header title="Report" />

        <Content className="report-container">
          {/* 🔹 ใส่ตารางที่มี Mock Data */}
          <div className="bg-white p-4 shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">สรุปรายงานโครงการ</h2>
              <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                เพิ่มรายงาน
              </Button>
            </div>
            <Table columns={columns} dataSource={mockData} pagination={{ pageSize: 5 }} />
          </div>
        </Content>

        {/* 🔹 Modal สำหรับเพิ่มรายงาน */}
        <Modal title="เพิ่มรายงาน" open={isModalVisible} onCancel={handleCancel} footer={null}>
          <Form layout="vertical" form={form} onFinish={handleAddReport}>
            <Form.Item label="ชื่อโครงการ" name="project_name" rules={[{ required: true, message: "กรุณากรอกชื่อโครงการ" }]}>
              <Input placeholder="ระบุชื่อโครงการ" />
            </Form.Item>
            <Form.Item label="งบประมาณรวม" name="total_budget" rules={[{ required: true, message: "กรุณาระบุงบประมาณรวม" }]}>
              <Input placeholder="0.00" type="number" suffix="บาท" />
            </Form.Item>
            <Form.Item label="งบประมาณที่ใช้ไป" name="used_budget" rules={[{ required: true, message: "กรุณาระบุงบประมาณที่ใช้ไป" }]}>
              <Input placeholder="0.00" type="number" suffix="บาท" />
            </Form.Item>
            <Form.Item label="แนบเอกสาร" name="document">
              <Input type="file" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">บันทึก</Button>
              <Button className="ml-2" onClick={handleCancel}>ยกเลิก</Button>
            </Form.Item>
          </Form>
        </Modal>

        <Footer />
      </Layout>
    </Layout>
  );
};

export default Report;
