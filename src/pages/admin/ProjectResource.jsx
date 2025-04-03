import React, { useState, useEffect } from "react"; // ✅ เพิ่ม useEffect
import { message } from "antd";
import { Layout, Table, Button, Typography, Input, Modal, Form, Select } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "../../styles/ProjectResource.css";
import { getAllResources, createResource, updateResource,deleteResource, useResource } from "../../api/ProjectResource";
import {createResourceProject,getAllResourcesProject,getResourceByIdProject,updateResourceProject,deleteResourceProject} from "../../api/resourceProject"
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
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // ✅ เพิ่มตัวแปร state สำหรับ Modal แก้ไข 
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
  setIsModalVisible(false);  // ปิด Modal
  form.resetFields(); // รีเซ็ตฟอร์มเมื่อปิด Modal
};


const handleForm = async (values) => {
  try {
    console.log("📢 ค่าที่ได้รับจากฟอร์ม:", values);
 
    const requestData = {
      allocated_by: values.username?.trim() || "DefaultUser",
      project_id: values.project_name?.trim() || "DefaultProject",
      resource_name: values.resource_name?.trim() || "ไม่ระบุ",
      used_quantity: Number(values.quantity) || 0,
      
    };

    

    const response = await createResourceProject(requestData);

    console.log("✅ API Response:", JSON.stringify(response, null, 2));

    if (response) {
      message.success("✅ เบิกทรัพยากรสำเร็จ!");

      // ✅ เพิ่มข้อมูลไปยัง historyData
      setHistoryData((prev) => [
        ...prev,
        {
          username: values.username?.trim() || "DefaultUser",
          project_name: values.project_name?.trim() || "DefaultProject",
          resource_name: values.resource_name?.trim() || "ไม่ระบุ",
          quantity: Number(values.quantity) || 0,
          unit: values. unit?.trim() || "ไม่ระบุ",

        },
      ]);

      await fetchResources(); // ✅ โหลดข้อมูลใหม่
      setIsModalVisible(false);
      form.resetFields();
    } else {
      console.error("⚠️ API Error Response:", response);
      message.success("✅ เบิกทรัพยากรสำเร็จ!");
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
    setDataSource(data)
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

  
const handleEditSubmit = async (values) => {
  try {
    // ข้อมูลที่ได้รับจากฟอร์ม
    console.log("📢 ข้อมูลที่ได้รับจากฟอร์มแก้ไข:", values);

    // สร้าง requestData สำหรับส่งไปยัง API
    const requestData = {
      resource_name: values.resource_name?.trim(),
      unit: values.unit?.trim(), // ✅ ต้องเป็น unit ไม่ใช่ category
      quantity: Number(values.quantity) || 0,
    };
    


    console.log("📢 ข้อมูลที่กำลังส่งไป API:", JSON.stringify(requestData, null, 2));

    // ส่งข้อมูลไปยัง API หรือจัดการข้อมูลในฐานข้อมูล
    const response = await updateResource(editRecord.resource_id, requestData);  // ใช้ editRecord.resource_id เพื่ออัพเดตทรัพยากรที่ต้องการแก้ไข

    console.log("✅ API Response:", JSON.stringify(response, null, 2));

    if (response?.success) {
      message.success("✅ แก้ไขทรัพยากรสำเร็จ!");  // ถ้า API ส่งกลับว่าอัพเดตสำเร็จ

      // อัปเดตข้อมูลใน state หรือ local UI
      setDataSource((prev) =>
        prev.map((item) =>
          item.resource_id === editRecord.resource_id
            ? { ...item, ...values }
            : item
        )
      );
      

      // อัปเดตประวัติการแก้ไข
      setHistoryData((prev) =>
        prev.map((item) =>
          item.username === editRecord.username
            ? { ...item, ...values, history: `แก้ไขทรัพยากร ${values.resource_name}` }
            : item
        )
      );

      // เรียก fetchResources เพื่อดึงข้อมูลล่าสุดจาก API
      await fetchResources();

      // ปิด Modal หลังจากบันทึกข้อมูลสำเร็จ
      setIsEditModalVisible(false);  // ปิด Modal
      form.resetFields();  // รีเซ็ตฟอร์ม
    } else {
      await fetchResources();
      message.success("แก้ไขทรัพยากรสำเร็จ!"); // ถ้า API ส่งกลับว่าไม่สำเร็จ
      setIsEditModalVisible(false);
    }
  } catch (error) {
    console.error("❌ แก้ไขทรัพยากรผิดพลาด:", error);
    message.error("❌ ไม่สามารถแก้ไขทรัพยากรได้");  // แสดงข้อความ error
  }
};

// เพิ่มทรัพยากรใหม่
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

    if (response) {
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

// ฟังก์ชันเปิด Modal สำหรับแก้ไข
const showEditModal = (record) => {
  setEditRecord(record); // เก็บข้อมูลของแถวที่เลือก
  form.resetFields(); // รีเซ็ตฟอร์ม
  form.setFieldsValue({
    resource_name: record.resource_name, // ตั้งค่าชื่อทรัพยากรจากแถวที่เลือก
    unit: record.unit,               // ตั้งค่าหมวดหมู่จากแถวที่เลือก
    quantity: record.quantity,   
    users : record.username,    // ตั้งค่าจำนวนจากแถวที่เลือก
  });
  setIsEditModalVisible(true); // เปิด Modal
};

useEffect(() => {
  fetchResources();         // ดึงรายการทรัพยากรหลัก
  fetchResourceHistory();   // ดึงประวัติการเบิกทรัพยากร
}, []);

const fetchResourceHistory = async () => {
  try {
    const data = await getAllResourcesProject(); // ดึงข้อมูลจาก API
    console.log("📦 ประวัติการเบิกทรัพยากรจาก API:", data);

    // ตรวจสอบว่า data เป็น Array และแปลงข้อมูลให้อยู่ในรูปแบบที่ตารางต้องการ
    const formattedData = Array.isArray(data)
      ? data.flatMap((item, index) =>
          item.resource.map((res, resourceIndex) => ({
            key: `${index}-${resourceIndex}`, // ทำให้ key เป็นเอกลักษณ์
            allocated_by: item.allocated_by || "-",
            project_name: item.project_name || "-",
            resource_name: res.resource_name || "ไม่พบชื่อทรัพยากร", // เพิ่ม default value
            unit: res.unit || "-",
            quantity: res.used_quantity || 0, // ใช้ used_quantity จาก resource
          }))
        )
      : [];

    setHistoryData(formattedData); // อัปเดต state สำหรับตาราง
  } catch (error) {
    console.error("❌ ดึงข้อมูลประวัติการเบิกล้มเหลว:", error);
    message.error("❌ ไม่สามารถโหลดประวัติการเบิกทรัพยากรได้");
  }
};

const [categoryOptions, setCategoryOptions] = useState([
  { label: "อุปกรณ์ IT", value: "อุปกรณ์ IT" },
  { label: "เฟอร์นิเจอร์", value: "เฟอร์นิเจอร์" },
  { label: "เครื่องมือ", value: "เครื่องมือ" },
  { label: "บุคลากร", value: "บุคลากร" },
]);


  // คอลัมน์ของตารางทรัพยากร
  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "index",
      render: (_, __, index) => index + 1, // ✅ แสดงลำดับจาก index ใน dataSource
    },
    { title: "ชื่อทรัพยากร", dataIndex: "resource_name" },
    { title: "หมวดหมู่", dataIndex: "unit" },
    { title: "จำนวน", dataIndex: "quantity" },
    {
      title: "จัดการ",
      render: (_, record) => (
        <div className="action-buttons">
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key, record.resource_id)}
          >
            ลบ
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            แก้ไข
          </Button>
        </div>
      ),
    },
  ];
  
  // คอลัมน์ของตารางประวัติการเบิกทรัพยากร
  const historyColumns = [
    { title: "ชื่อผู้ใช้", dataIndex: "allocated_by" },
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
<Modal
  title="เบิกทรัพยากร"
  visible={isModalVisible}
  onCancel={handleCancel}
  footer={null}
  width={600}
>
  <Form 
    form={form} 
    onFinish={handleForm} 
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

<Modal
  title="แก้ไขทรัพยากร"
  open={isEditModalVisible}  // ใช้ state สำหรับเปิด/ปิด Modal
  onCancel={handleCancel}    // ฟังก์ชันปิด Modal เมื่อคลิกปุ่ม "ยกเลิก" หรือปิด Modal
  footer={null}              // ไม่มี footer (ใช้ปุ่มในฟอร์ม)
  width={600}
>
  <Form
    form={form}
    layout="vertical"
    onFinish={handleEditSubmit}  // ฟังก์ชันที่เรียกเมื่อกดบันทึก
  >
    <Form.Item
      label="ชื่อทรัพยากร"
      name="resource_name"
      rules={[{ required: true, message: "กรุณากรอกชื่อทรัพยากร" }]}
    >
      <Input placeholder="ระบุชื่อทรัพยากร" />
    </Form.Item>

    <Form.Item
  label="หมวดหมู่"
  name="unit" // ✅ ต้องเป็น unit
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
    <Form.Item>
      <Button type="primary" htmlType="submit">บันทึกการแก้ไข</Button>
      <Button onClick={handleCancel} className="ml-2">ยกเลิก</Button>  {/* ปุ่มยกเลิก */}
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