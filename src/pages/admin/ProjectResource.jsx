import React, { useState } from "react";
import { message } from "antd";
import { Layout, Table, Button, Typography, Input, Modal, Form, Select } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "../../styles/ProjectResource.css";
import { getAllResources, createResource, updateResource, deleteResource, useResource } from "../../api/ProjectResource";

const { Sider, Content } = Layout;

const ProjectResource = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); // State สำหรับเปิด/ปิด Modal
  const [form] = Form.useForm(); // ฟอร์ม instance สำหรับ Modal
  const [editForm] = Form.useForm(); // ฟอร์ม instance สำหรับ Modal แก้ไข
  const [dataSource, setDataSource] = useState([]); // State สำหรับเก็บข้อมูลที่กรอกในฟอร์ม
  const [historyData, setHistoryData] = useState([]); // State สำหรับประวัติการเบิกทรัพยากร
  const [count, setCount] = useState(0); // ตัวนับเพื่อเพิ่ม key ให้กับข้อมูลใหม่
  const [editRecord, setEditRecord] = useState(null); // เก็บข้อมูลของรายการที่ต้องการแก้ไข
  const [isAddResourceModalVisible, setIsAddResourceModalVisible] = useState(false);
  const [formAdd] = Form.useForm();

  
  const showModal = () => {
    setEditRecord(null); // ✅ ตั้งค่าเป็น null เพื่อให้เป็นโหมดเพิ่ม
    form.resetFields(); // ✅ รีเซ็ตฟอร์มให้ว่าง
    setIsModalVisible(true); // ✅ เปิด Modal
  };
  
  
    // ✅ เปิด Modal "เพิ่มทรัพยากร"
  const showAddResourceModal = () => {
    setIsAddResourceModalVisible(true);
  };
    // ✅ ปิด Modal "เพิ่มทรัพยากร"
    const handleCancelAddResource = () => {
      setIsAddResourceModalVisible(false);
      formAdd.resetFields();
    };

  // ฟังก์ชันปิด Modal เมื่อกด "ยกเลิก"
  const handleCancel = () => {
    setIsModalVisible(false);
    setIsModalVisible(false);
    form.resetFields(); // รีเซ็ตฟอร์มเมื่อปิด Modal
    editForm.resetFields();
  };

  // ฟังก์ชันเมื่อกรอกข้อมูลในฟอร์มและกด "ขอนุมัติ"
  const handleFormSubmit = async (values) => {
    try {
      const requestData = {
        username: values.username,
        project_name: values.project_name,
        resource_name: values.category, // ✅ เปลี่ยน category เป็น resource_name
        quantity: Number(values.quantity), // ✅ แปลงเป็นตัวเลขก่อนส่ง
        unit: values.category, // ✅ ตั้งค่า unit เป็นค่าของหมวดหมู่
      };
  
      if (isNaN(requestData.quantity)) {
        message.error("❌ Quantity ต้องเป็นตัวเลข");
        return;
      }
  
      console.log("📢 กำลังส่งข้อมูลไปยัง API:", requestData); // ✅ Debug Data
      
      const response = await createResource(requestData);
      
      if (response && response.success) {
        message.success("✅ เบิกทรัพยากรสำเร็จ!");
        fetchResources(); // ✅ โหลดข้อมูลใหม่
        setDataSource(await getAllResources()); // ✅ โหลดข้อมูลใหม่จาก API
        setIsModalVisible(false);
        form.resetFields();
      } else {
        message.error("⚠️ มีบางอย่างผิดพลาดในการเพิ่มทรัพยากร");
      }
    } catch (error) {
      console.error("❌ Error requesting resource:", error);
      message.error("❌ ไม่สามารถเบิกทรัพยากรได้");
    }
  };
  

  
  
  // ฟังก์ชันลบข้อมูล
  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

const showEditModal = (record) => {
  console.log("📢 เปิด Modal แก้ไข:", record);
  setEditRecord(record); // ✅ กำหนดค่าที่ต้องการแก้ไข
  form.setFieldsValue(record); // ✅ โหลดค่าที่มีอยู่ในฟอร์ม
  setIsModalVisible(true); // ✅ เปิด Modal
};

  
const handleEditSubmit = (values) => {
  setDataSource((prev) =>
    prev.map((item) =>
      item.key === editRecord.key ? { ...item, ...values } : item
    )
  );

  setHistoryData((prev) =>
    prev.map((item) =>
      item.username === editRecord.username
        ? { ...item, ...values, history: `แก้ไขทรัพยากร ${values.projectName}` }
        : item
    )
  );

  message.success("✅ แก้ไขข้อมูลสำเร็จ!");
  setIsEditModalVisible(false); // ✅ ปิด Modal
  editForm.resetFields(); // ✅ รีเซ็ตฟอร์ม
};

  

const handleAddCategory = async () => {
  try {
    const values = await formAdd.validateFields(); // ✅ ตรวจสอบค่าที่กรอก
    console.log("📢 กำลังส่งข้อมูลไปยัง API:", values);

    await createResource({
      name: values.category,  // ✅ ใช้ category เป็น name ใน API
      category: values.category,
      quantity: values.quantity,
    });

    message.success("✅ เพิ่มทรัพยากรสำเร็จ!");
    fetchResources(); // ✅ โหลดข้อมูลใหม่
    setIsAddResourceModalVisible(false); // ✅ ปิด Modal
    formAdd.resetFields(); // ✅ รีเซ็ตฟอร์ม
  } catch (error) {
    console.error("❌ Error creating resource:", error);
    message.error("❌ ไม่สามารถเพิ่มทรัพยากรได้");
  }
};





const [categoryOptions, setCategoryOptions] = useState([
  { label: "อุปกรณ์ IT", value: "อุปกรณ์ IT" },
  { label: "เฟอร์นิเจอร์", value: "เฟอร์นิเจอร์" },
  { label: "เครื่องมือ", value: "เครื่องมือ" },
  { label: "บุคลากร", value: "บุคลากร" },
]);


  // คอลัมน์ของตาราง
  const columns = [
    { title: "ลำดับ", dataIndex: "key" },
    { title: "Username", dataIndex: "username" },
    { title: "ชื่อโครงการ", dataIndex: "project_name" },
    { title: "หมวดหมู่", dataIndex: "unit" },
    { title: "จำนวน", dataIndex: "quantity" },
    {
      title: "จัดการ", render: (_, record) => (
        <div className="action-buttons">
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.key)}>ลบ</Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => showEditModal(record)}>
  แก้ไข
</Button>


        </div>
      ),
    },
  ];

  // คอลัมน์ของตารางประวัติการเบิกทรัพยากร
  const historyColumns = [
    { title: "ชื่อผู้ใช้", dataIndex: "username" },
    { title: "โครงการ", dataIndex: "project" },
    { title: "เบิกทรัพยากร", dataIndex: "resource_name" },
    { title: "หมวดหมู่", dataIndex: "unit" },
    { title: "จำนวน", dataIndex: "quantity" },

  ];

  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      {/* Sidebar */}
      <Sider width={220} className="lg:block hidden">
        <Sidebar />
      </Sider>
      <Layout>
        <Header title="รายการทรัพยากร" />
        <Content className="projectResource-container">
          <Typography.Text className="projectResource-title">รายการทรัพยากร</Typography.Text>

          <div className="projectResource-header">
            <Input
              placeholder="ค้นหารายการทรัพยากร"
              prefix={<SearchOutlined style={{ color: "rgba(0,0,0,0.45)" }} />}
              className="projectResource-search"
            />
            <button type="primary" className="custom-search-button">ค้นหา</button>
            <Button type="primary" className="resources-button" onClick={showModal}>
              เบิกทรัพยากร
            </Button>
            <Button type="primary" className="add-resorces" onClick={showAddResourceModal}>
              เพิ่มทรัพยากร
            </Button>
          </div>
          {/* Modal สำหรับเบิกทรัพยากร */}
          <Modal
            title="เบิกทรัพยากร"
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            width={600}
          >
            <Form form={form} onFinish={handleFormSubmit} layout="vertical">
              <Form.Item label="Username" name="username" rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้" }]}>
                <Input placeholder="username" />
              </Form.Item>

              <Form.Item label="ชื่อโครงการ" name="project_name" rules={[{ required: true, message: "กรุณากรอกชื่อโครงการ" }]}>
                <Input placeholder="ระบุชื่อโครงการ" />
              </Form.Item>

              <Form.Item label="เบิก" name="resource_name" rules={[{ required: true, message: "กรุณาเลือกหมวดหมู่" }]}>
  <Select placeholder="เลือกหมวดหมู่">
    {categoryOptions.map(option => (
      <Select.Option key={option.value} value={option.value}>
        {option.label}
      </Select.Option>
    ))}
  </Select>
</Form.Item>


<Form.Item label="หมวดหมู่" name="category" rules={[{ required: true, message: "กรุณาเลือกหมวดหมู่" }]}> 
  <Select placeholder="เลือกหมวดหมู่">
    {categoryOptions.map(option => (
      <Select.Option key={option.value} value={option.value}>
        {option.label}
      </Select.Option>
    ))}
  </Select>
</Form.Item>


              <Form.Item label="จำนวน" name="quantity" rules={[{ required: true, message: "กรุณากรอกจำนวน" }]}>
                <Input type="number" placeholder="จำนวน" />
              </Form.Item>

              <Form.Item>
  <Button type="primary" htmlType="submit">
    {editRecord ? "บันทึกการแก้ไข" : "ขอนุมัติ"}
  </Button>
  <Button onClick={handleCancel} className="ml-2">ยกเลิก</Button>
</Form.Item>
            </Form>
          </Modal>
            <Form.Item>
              
            </Form.Item>

          


    

            <Modal 
  title="เพิ่มทรัพยากร" 
  open={isAddResourceModalVisible} 
  onCancel={handleCancelAddResource} 
  footer={null}
  width={600}
>
  <Form form={formAdd} layout="vertical" onFinish={handleAddCategory}>
    
    <Form.Item 
      label="หมวดหมู่" 
      name="category" 
      rules={[{ required: true, message: "กรุณาตั้งหมวดหมู่" }]}
    >
      <Input placeholder="ตั้งหมวดหมู่" />
    </Form.Item>

    <Form.Item 
      label="จำนวน" 
      name="quantity" 
      rules={[{ required: true, message: "กรุณาระบุจำนวน" }]}
    >
      <Input type="number" placeholder="ระบุจำนวน" />
    </Form.Item>

    <Form.Item>
      <Button type="primary" htmlType="submit">เพิ่ม</Button>
      <Button onClick={handleCancelAddResource} className="ml-2">ยกเลิก</Button>
    </Form.Item>

  </Form>
</Modal>


          {/* ตารางทรัพยากร */}
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={{ pageSize: 6, showSizeChanger: false }}
            className="projectResource-table"
          />

        </Content>

        {/* ตารางประวัติการเบิกทรัพยากร */}
        <Content className="projectResource-container">
          <Typography.Text strong style={{ fontSize: "16px", color: "#333" }}>
            ประวัติการเบิกทรัพยากร
          </Typography.Text>

          <Table
            columns={historyColumns}
            dataSource={historyData}
            pagination={{ pageSize: 5, showSizeChanger: false }}
            className="resource-table"
          />
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default ProjectResource;
