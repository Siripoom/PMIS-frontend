import React, { useState } from "react";
import { Layout, Table, Button, Modal, Form, Input, Select } from "antd";
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import "../../styles/UserManagement.css";
import Footer from "../../components/Footer/Footer";

const { Sider, Content } = Layout;
const { Option } = Select;

const UserManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 📌 รายชื่อผู้ใช้ (Mock Data)
  const users = [
    { key: "1", name: "นายพลัฏฐ์ พลาการวัฒนา", username: "phalat01", role: "Admin", password: "1234" },
    { key: "2", name: "นายวัตสิริ สุหวาน", username: "pickup00", role: "Manager", password: "3210" },
    { key: "3", name: "นายปิ๊กอัพ คนบ้านนา", username: "pickupza55", role: "Manager", password: "4321" },
  ];

  // 📌 คอลัมน์ของตาราง
  const columns = [
    { title: "ลำดับ", dataIndex: "index", key: "index", render: (_, __, index) => index + 1 },
    { title: "รายชื่อ", dataIndex: "name", key: "name" },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "Password", dataIndex: "password", key: "password" },
    {
      title: "",
      key: "action",
      align: "center",
      render: () => (
        <div className="action-icons">
          <Button type="link" icon={<EyeOutlined />} />
          <Button type="link" icon={<EditOutlined />} />
          <Button type="link" danger icon={<DeleteOutlined />} />
        </div>
      ),
    },
  ];

  // 📌 เปิด/ปิด Modal
  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      <Sider width={220} className="lg:block hidden">
        <Sidebar />
      </Sider>

      <Layout>
        <Header title="บัญชีผู้ดูแล" />

        <Content className="userManagement-container">
          <div className="table-container">
            <div className="header-container">
              <h2>การจัดการบัญชี</h2>
              <Button type="primary" icon={<PlusOutlined />} onClick={showModal} className="add-button">
                เพิ่ม
              </Button>
            </div>
            <Table columns={columns} dataSource={users} rowKey="key" pagination={false} />
          </div>
        </Content>

        <Footer />
      </Layout>

      {/* 📌 Modal เพิ่มผู้ใช้ */}
      <Modal
        title="เพิ่มผู้ใช้ใหม่"
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText="บันทึก"
        cancelText="ยกเลิก"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="ชื่อ-นามสกุล" rules={[{ required: true, message: "กรุณากรอกชื่อ" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="username" label="Username" rules={[{ required: true, message: "กรุณากรอก Username" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true, message: "เลือก Role" }]}>
            <Select>
              <Option value="Admin">Admin</Option>
              <Option value="Manager">Manager</Option>
            </Select>
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน" }]}>
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default UserManagement;
