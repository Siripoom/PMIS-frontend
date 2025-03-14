import React, { useState, useEffect } from "react";
import { Layout, Table, Button, Modal, Form, Input, Select, message } from "antd";
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import "../../styles/UserManagement.css";
import Footer from "../../components/Footer/Footer";
import { addUser, getAllUser, deleteUser, editUser } from "../../api/userManager"; // ✅ เพิ่ม getAllUsers


const { Sider, Content } = Layout;
const { Option } = Select;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  // ✅ เปิด Modal แก้ไข
const showEditModal = (user) => {
  setEditingUser(user);
  form.setFieldsValue(user); // ✅ ตั้งค่าข้อมูลที่มีอยู่เดิม
  setIsEditModalVisible(true);
};

// ✅ ปิด Modal แก้ไข
const handleCancelEdit = () => {
  setIsEditModalVisible(false);
  setEditingUser(null);
};
  // ✅ โหลดข้อมูลผู้ใช้จาก API เมื่อหน้าโหลด
  const fetchUsers = async () => {
    setLoading(true);
    try {
      console.log("📢 กำลังดึงข้อมูลผู้ใช้จาก API...");
      const response = await getAllUser(); // ✅ ดึงข้อมูลจาก API
  
      console.log("✅ API Response:", response.data); // 🔍 ตรวจสอบค่าที่ได้จาก API
  
      if (!response || !response.data) {
        console.error("❌ API ส่งข้อมูลผิดโครงสร้าง:", response);
        message.error("❌ ไม่สามารถโหลดข้อมูลผู้ใช้ได้");
        setUsers([]); 
        return;
      }
  
      // ✅ ปรับโครงสร้างข้อมูลให้ตรงกับ API
      const formattedUsers = response.data.map((user, index) => ({
        key: index + 1,  
        id: user.user_id,  // ✅ ใช้ `user_id` จาก API
        username: user.username,
        email: user.email,
        role: user.role,
        password: "********",  // ✅ ไม่มี `password` ใน API → ซ่อนเป็น `********`
      }));
  
      setUsers(formattedUsers);
      console.log("✅ ข้อมูลผู้ใช้ที่ถูกต้อง:", formattedUsers);
    } catch (error) {
      console.error("❌ ดึงข้อมูลผู้ใช้ล้มเหลว:", error);
      message.error("❌ ไม่สามารถโหลดข้อมูลผู้ใช้ได้");
    } finally {
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    fetchUsers();
  }, []); // ✅ ดึงข้อมูลจาก API ตอนหน้าโหลด
  const handleEditUser = async (values) => {
    try {
      console.log("✏️ กำลังอัปเดตข้อมูลผู้ใช้:", values);
  
      await editUser(editingUser.id, values); // ✅ เรียก API เพื่อแก้ไขข้อมูล
      message.success("✅ แก้ไขข้อมูลสำเร็จ!");
  
      // ✅ อัปเดตตารางโดยเปลี่ยนค่าผู้ใช้ที่ถูกแก้ไข
      setUsers(users.map(user => user.id === editingUser.id ? { ...user, ...values } : user));
  
      handleCancelEdit();
    } catch (error) {
      console.error("❌ แก้ไขข้อมูลล้มเหลว:", error);
      message.error("❌ ไม่สามารถแก้ไขข้อมูลได้");
    }
  };
  // ✅ ฟังก์ชันเปิด Modal
  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleAddUser = async (values) => {
    try {
      console.log("📢 กำลังส่งข้อมูลผู้ใช้ก่อนกรอง:", values);

      // ✅ ลบ `confirmPassword` ออกก่อนส่งไปยัง API
      const { confirmPassword, ...userData } = values;

      console.log("✅ ข้อมูลที่ส่งไปยัง API:", userData);

      // ✅ ส่งข้อมูลไปยัง API
      const response = await addUser(userData);
      message.success("✅ เพิ่มผู้ใช้สำเร็จ!");
      console.log("✅ API Response:", response);

      // ✅ ตรวจสอบว่า API ส่งข้อมูลที่ถูกต้อง
      if (!response || !response.data) {
        message.error("❌ API ไม่ได้ส่งข้อมูลผู้ใช้กลับมา");
        return;
      }

      // ✅ สร้าง Object ใหม่จาก API Response และเพิ่มเข้าไปที่ `users`
      const newUser = {
        key: users.length + 1,  // ✅ ให้ key เป็น index ล่าสุด
        id: response.data.user_id || response.data.id,  // ✅ ใช้ user_id จาก API
        Username: response.data.username,
        Email: response.data.email,
        Role: response.data.role,
        password: "********",  // ✅ ซ่อนรหัสผ่าน
      };

      // ✅ อัปเดต `users` โดยไม่ต้องโหลดใหม่จาก API
      setUsers([...users, newUser]);

      handleCancel(); // ✅ ปิด Modal และรีเซ็ตฟอร์ม
    } catch (error) {
      console.error("❌ เพิ่มผู้ใช้ล้มเหลว:", error);
      message.error("❌ ไม่สามารถเพิ่มผู้ใช้ได้");
    }
};
useEffect(() => {
  fetchUsers();
}, []);
const handleDeleteUser = (userId) => {
  Modal.confirm({
    title: "ยืนยันการลบ",
    content: "คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?",
    okText: "ใช่, ลบเลย",
    cancelText: "ยกเลิก",
    okType: "danger",
    onOk: async () => {
      try {
        console.log(`🗑️ กำลังลบผู้ใช้ ID: ${userId}`);

        await deleteUser(userId); // ✅ เรียก API เพื่อลบข้อมูล
        message.success("✅ ลบผู้ใช้สำเร็จ!");

        // ✅ อัปเดตตารางโดยลบแถวที่เกี่ยวข้อง
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error("❌ ลบผู้ใช้ล้มเหลว:", error);
        message.error("❌ ไม่สามารถลบผู้ใช้ได้");
      }
    },
  });
};

  // ✅ คอลัมน์ของตาราง
  const columns = [
    { title: "ลำดับ", dataIndex: "key", key: "key" }, 
    { title: "Username", dataIndex: "username", key: "username" }, // ✅ ตรวจสอบว่า API ส่ง username มา
    { title: "Email", dataIndex: "email", key: "email" }, // ✅ ตรวจสอบอีเมลด้วย
    { title: "Role", dataIndex: "role", key: "role" }, // ✅ ตรวจสอบว่า API ส่ง role มา
    { title: "Password", dataIndex: "password", key: "password" },
    {
      title: "จัดการ",
      key: "action",
      align: "center",
      render: (text, record) => (
        <div className="action-icons">
          <Button type="link" icon={<EyeOutlined />} />
          <Button type="link" icon={<EditOutlined />} onClick={() => showEditModal(record)} /> 
          <Button 
          type="link" 
          danger 
          icon={<DeleteOutlined />} 
          onClick={() => handleDeleteUser(record.id)} // ✅ ผูกฟังก์ชันลบกับปุ่ม
        />
      </div>
      ),
    },
  ];

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
            <Table 
  columns={columns}
  dataSource={users} // ✅ ใช้ข้อมูลที่ได้จาก fetchUsers()
  rowKey="key"
  loading={loading}
  pagination={{ pageSize: 5 }}
/>

          </div>
        </Content>

        <Footer />
      </Layout>

        {/* 📌 Modal เพิ่มผู้ใช้ */}
        <Modal
          title="เพิ่มผู้ใช้ใหม่"
          open={isModalVisible}
          onCancel={handleCancel}
          onOk={() => form.submit()}
          okText="บันทึก"
          cancelText="ยกเลิก"
        >
<Form form={form} layout="vertical" onFinish={handleAddUser}>
  <Form.Item name="username" label="Username" rules={[{ required: true, message: "กรุณากรอก Username" }]}>
    <Input />
  </Form.Item>
  <Form.Item name="email" label="Email" rules={[{ required: true, message: "กรุณากรอก Email" }]}>
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
  <Form.Item 
    name="confirmPassword" 
    label="Confirm Password" 
    dependencies={["password"]} 
    rules={[
      { required: true, message: "กรุณายืนยันรหัสผ่าน" },
      ({ getFieldValue }) => ({
        validator(_, value) {
          if (!value || getFieldValue("password") === value) {
            return Promise.resolve();
          }
          return Promise.reject(new Error("รหัสผ่านไม่ตรงกัน"));
        },
      }),
    ]}
  >
    <Input.Password placeholder="ยืนยันรหัสผ่าน" />
  </Form.Item>
</Form>
        </Modal>

        <Modal
  title="แก้ไขข้อมูลผู้ใช้"
  open={isEditModalVisible}
  onCancel={handleCancelEdit}
  onOk={() => form.submit()}
  okText="บันทึก"
  cancelText="ยกเลิก"
>
  <Form form={form} layout="vertical" onFinish={handleEditUser}>
    <Form.Item name="username" label="Username" rules={[{ required: true, message: "กรุณากรอก Username" }]}>
      <Input />
    </Form.Item>
    <Form.Item name="email" label="Email" rules={[{ required: true, message: "กรุณากรอก Email" }]}>
      <Input />
    </Form.Item>
    <Form.Item name="role" label="Role" rules={[{ required: true, message: "เลือก Role" }]}>
      <Select>
        <Option value="Admin">Admin</Option>
        <Option value="Manager">Manager</Option>
      </Select>
    </Form.Item>
    <Form.Item name="password" label="Password">
      <Input.Password placeholder="กรอกรหัสผ่านใหม่หากต้องการเปลี่ยน" />
    </Form.Item>
  </Form>
</Modal>

    </Layout>
  );
};

export default UserManagement;
