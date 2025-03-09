import React, { useState, useEffect } from "react"; // ✅ เพิ่ม useEffect
import { message } from "antd";
import { Layout, Table, Button, Typography, Input, Modal, Form, Select } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "../../styles/ProjectResource.css";
import { getAllResources, createResource, updateResource,deleteResource, useResource } from "../../api/ProjectResource";

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
  const [loading, setLoading] = useState(false); // ✅ เพิ่มตัวแปร state
  useEffect(() => {
    fetchResources();
  }, []);
  
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

const handleFormSubmit = async (values) => {
  try {
    console.log("📢 ค่าที่ได้รับจากฟอร์ม:", values);

    const requestData = {
      username: values.username?.trim() || "DefaultUser",
      project_name: values.project_name?.trim() || "DefaultProject",
      resource_name: values.resource_name?.trim() || "ไม่ระบุ",
      quantity: Number(values.quantity) || 0,
      unit: values.category?.trim() || "ไม่ระบุ",
    };

    console.log("📢 ข้อมูลที่กำลังส่งไป API:", JSON.stringify(requestData, null, 2));

    const response = await createResource(requestData);

    console.log("✅ API Response:", JSON.stringify(response, null, 2));

    if (response && response.message === "Resource created successfully") {
      message.success("✅ เบิกทรัพยากรสำเร็จ!");

      // ✅ เพิ่มข้อมูลไปยัง historyData
      setHistoryData((prev) => [
        ...prev,
        {
          username: values.username?.trim() || "DefaultUser",
          project_name: values.project_name?.trim() || "DefaultProject",
          resource_name: values.resource_name?.trim() || "ไม่ระบุ",
          quantity: Number(values.quantity) || 0,
          unit: values.category?.trim() || "ไม่ระบุ",

        },
      ]);

      await fetchResources(); // ✅ โหลดข้อมูลใหม่
      setIsModalVisible(false);
      form.resetFields();
    } else {
      console.error("⚠️ API Error Response:", response);
      message.error("⚠️ มีบางอย่างผิดพลาดในการเพิ่มทรัพยากร");
    }
  } catch (error) {
    console.error("❌ API Error:", error);
    message.error("❌ ไม่สามารถเบิกทรัพยากรได้");
  }
};

const fetchResources = async () => {
  setLoading(true);
  try {
    const data = await getAllResources();
    console.log("📢 ข้อมูลจาก API:", data); // ✅ ตรวจสอบ API Response

    setDataSource(
      data.map((item, index) => ({
        key: index + 1, // ✅ ใช้ index เป็น key
        resource_id: item.resource_id, // ✅ ต้องมีฟิลด์นี้
        resource_name: item.resource_name || "ไม่มีข้อมูล",
        unit: item.unit || "ไม่มีข้อมูล",
        quantity : item.quantity || 0,
      }))
    );
    setHistoryData(
      data.map((item, index) => ({
        username: item.username || "ไม่ระบุ", // ✅ ควรตรงกับค่าที่ส่งไป
        project_name: item.project_name || "ไม่ระบุ",
        resource_name: item.resource_name || "ไม่มีข้อมูล",
        unit: item.unit || "ไม่มีข้อมูล",
        quantity: item.quantity || 0,
        created_at: item.created_at || "ไม่ระบุ"
      }))
    );
  } catch (error) {
    console.error("❌ โหลดข้อมูลทรัพยากรล้มเหลว:", error);
    message.error("❌ โหลดข้อมูลทรัพยากรล้มเหลว");
  } finally {
    setLoading(false);
  }
};

  
const handleDelete = async (key, id) => {
  console.log(`📢 กำลังส่งคำขอลบทรัพยากร: ID = ${id}`);

  if (!id) {
    console.error("❌ ID ไม่ถูกต้อง:", id);
    message.error("❌ ไม่สามารถลบได้ เนื่องจาก ID ไม่ถูกต้อง");
    return;
  }

  try {
    const response = await deleteResource(id);
    
    if (response?.success) {
      console.log(`✅ ทรัพยากร ID: ${id} ถูกลบแล้ว!`);
      
      // ✅ อัปเดต UI โดยเอาทรัพยากรที่ถูกลบออกจาก dataSource
      setDataSource((prev) => prev.filter((item) => item.resource_id !== id));
      
      message.success("✅ ลบทรัพยากรสำเร็จ!");
    } else {
      console.warn(`⚠️ ไม่สามารถลบทรัพยากร ID: ${id}`);
      message.warning("⚠️ ลบไม่สำเร็จ โปรดลองใหม่!");
    }
  } catch (error) {
    console.error("❌ ลบทรัพยากรผิดพลาด:", error);
    message.error("❌ ลบทรัพยากรไม่สำเร็จ");
  }
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

  

const handleAddResource = async () => {
  try {
    const values = await formAdd.validateFields();
    console.log("📢 เพิ่มทรัพยากร:", values);

    // ตรวจสอบค่าก่อนส่ง API
    if (!values.resource_name || !values.quantity || !values.category || !values.username) {
      message.error("❌ โปรดกรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const requestData = {
      resource_name: values.resource_name.trim(),
      quantity: Number(values.quantity), // ✅ เปลี่ยนจาก used_quantity เป็น quantity
      unit: values.category.trim(), // ✅ ใช้ unit แทน category
      username: values.username.trim(),
    };

    console.log("📢 ข้อมูลที่กำลังส่งไป API:", JSON.stringify(requestData, null, 2));

    const response = await createResource(requestData);

    console.log("✅ API Response:", JSON.stringify(response, null, 2));

    if (response?.success) {
      message.success("✅ เพิ่มทรัพยากรสำเร็จ!");

      fetchResources(); // โหลดรายการทรัพยากรใหม่เพื่ออัปเดต Dropdown
      setIsAddResourceModalVisible(false); // ปิด Modal
      formAdd.resetFields(); // รีเซ็ตฟอร์ม
    } else {
      console.error("⚠️ API Error Response:", response);
      message.error("⚠️ มีบางอย่างผิดพลาดในการเพิ่มทรัพยากร");
    }
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
    { title: "ชื่อทรัพยากร", dataIndex: "resource_name" },
    { title: "หมวดหมู่", dataIndex: "unit" },
    { title: "จำนวน", dataIndex: "quantity" },
    {
      title: "จัดการ", render: (_, record) => (
        <div className="action-buttons">
          <Button
  type="link"
  danger
  icon={<DeleteOutlined />}
  onClick={() => {
    console.log("📢 Record ที่ถูกกดลบ:", record); // ✅ Debug ค่า record
    handleDelete(record.key, record.resource_id);
  }}
>
  ลบ
</Button>

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
    { title: "โครงการ", dataIndex: "project_name" },
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
         {/* Modal สำหรับเบิกทรัพยากร */}
<Modal
  title="เบิกทรัพยากร"
  visible={isModalVisible}
  onCancel={handleCancel}
  footer={null}
  width={600}
>
  <Form 
    form={form} 
    onFinish={handleFormSubmit} 
    layout="vertical"
    onValuesChange={(changedValues) => {
      if (changedValues.resource_name) {
        // ค้นหาหมวดหมู่ที่เกี่ยวข้องจาก categoryOptions
        const selectedCategory = categoryOptions.find(
          (option) => option.value === changedValues.resource_name
        );

        if (selectedCategory) {
          form.setFieldsValue({ category: selectedCategory.value });
        }
      }
    }}
  >
    <Form.Item 
      label="username" 
      name="username" 
      rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้" }]}
    >
      <Input placeholder="username" />
    </Form.Item>

    <Form.Item 
      label="ชื่อโครงการ" 
      name="project_name" 
      rules={[{ required: true, message: "กรุณากรอกชื่อโครงการ" }]}
    >
      <Input placeholder="ระบุชื่อโครงการ" />
    </Form.Item>

    {/* ✅ เมื่อเลือก "เบิก" ระบบจะตั้งค่า "หมวดหมู่ที่มี" อัตโนมัติ */}
    <Form.Item 
      label="เบิก" 
      name="resource_name" 
      rules={[{ required: true, message: "กรุณาเลือกหมวดหมู่" }]}
    >
      <Select placeholder="เลือกหมวดหมู่">
        {categoryOptions.map(option => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>

    <Form.Item 
      label="หมวดหมู่ที่มี" 
      name="category" 
      rules={[{ required: true, message: "กรุณาเลือกหมวดหมู่" }]}
    >
      <Select placeholder="เลือกหมวดหมู่ที่มีอยู่" disabled>
        {categoryOptions.map(option => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>

    <Form.Item 
      label="จำนวน" 
      name="quantity" 
      rules={[{ required: true, message: "กรุณากรอกจำนวน" }]}
    >
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

<Modal
  title="เพิ่มทรัพยากร"
  open={isAddResourceModalVisible}
  onCancel={handleCancelAddResource}
  footer={null}
  width={600}
>
<Form form={formAdd} layout="vertical" onFinish={handleAddResource}>
  <Form.Item 
    label="ชื่อทรัพยากร" 
    name="resource_name" 
    rules={[{ required: true, message: "กรุณากรอกชื่อทรัพยากร" }]}
  >
    <Input placeholder="ระบุชื่อทรัพยากร" />
  </Form.Item>

  <Form.Item 
    label="หมวดหมู่" 
    name="category" 
    rules={[{ required: true, message: "กรุณาเลือกหมวดหมู่" }]}
  >
    <Select placeholder="เลือกหมวดหมู่">
      {categoryOptions.map(option => (
        <Select.Option key={option.value} value={option.value}>
          {option.label}
        </Select.Option>
      ))}
    </Select>
  </Form.Item>

  <Form.Item 
    label="จำนวน" 
    name="quantity" 
    rules={[{ required: true, message: "กรุณาระบุจำนวน" }]}
  >
    <Input type="number" placeholder="ระบุจำนวน" />
  </Form.Item>

  <Form.Item 
    label="ชื่อผู้ใช้" 
    name="username" 
    rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้" }]}
  >
    <Input placeholder="ระบุชื่อผู้ใช้" />
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