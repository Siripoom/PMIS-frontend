import React, { useState, useEffect } from "react";
import { message } from "antd";
import {
  Layout,
  Table,
  Button,
  Typography,
  Input,
  Modal,
  Form,
  Select,
  Row,
  Col,
  Space,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  MenuOutlined,
  PlusOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "../../styles/ProjectResource.css";
import {
  getAllResources,
  createResource,
  updateResource,
  deleteResource,
} from "../../api/ProjectResource";
import {
  createResourceProject,
  getAllResourcesProject,
} from "../../api/resourceProject";

const { Sider, Content } = Layout;

const ProjectResource = () => {
  // States
  const [collapsed, setCollapsed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [isAddResourceModalVisible, setIsAddResourceModalVisible] =
    useState(false);
  const [formAdd] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const role = localStorage.getItem("role");

  // Category options for forms
  const [categoryOptions, setCategoryOptions] = useState([
    { label: "อุปกรณ์ IT", value: "อุปกรณ์ IT" },
    { label: "เฟอร์นิเจอร์", value: "เฟอร์นิเจอร์" },
    { label: "เครื่องมือ", value: "เครื่องมือ" },
    { label: "บุคลากร", value: "บุคลากร" },
  ]);

  // Fetch resources on component mount
  useEffect(() => {
    fetchResources();
    fetchResourceHistory();
  }, []);

  // Show, hide modals and reset forms
  const showModal = () => {
    setEditRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showAddResourceModal = () => {
    setIsAddResourceModalVisible(true);
  };

  const handleCancelAddResource = () => {
    setIsAddResourceModalVisible(false);
    formAdd.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEditModalVisible(false);
    form.resetFields();
  };

  // Handle form submissions
  const handleForm = async (values) => {
    try {
      console.log("📢 ค่าที่ได้รับจากฟอร์ม:", values);

      const response = await createResourceProject(values);

      console.log("✅ API Response:", JSON.stringify(response, null, 2));

      if (response) {
        message.success("✅ เบิกทรัพยากรสำเร็จ!");

        setHistoryData((prev) => [
          ...prev,
          {
            username: values.username?.trim(),
            project_name: values.project_name?.trim(),
            resource_name: values.resource_name?.trim(),
            used_quantity: Number(values.used_quantity),
            unit: values.unit?.trim(),
          },
        ]);

        await fetchResources();
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

  // Fetch resource data
  const fetchResources = async () => {
    setLoading(true);
    try {
      const data = await getAllResources();
      setDataSource(data);
    } catch (error) {
      console.error("❌ โหลดข้อมูลทรัพยากรล้มเหลว:", error);
      message.error("❌ โหลดข้อมูลทรัพยากรล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  // Delete resource
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

  // Edit resource
  const handleEditSubmit = async (values) => {
    try {
      const requestData = {
        resource_name: values.resource_name?.trim(),
        unit: values.unit?.trim(),
        quantity: Number(values.quantity) || 0,
      };

      console.log(
        "📢 ข้อมูลที่กำลังส่งไป API:",
        JSON.stringify(requestData, null, 2)
      );

      const response = await updateResource(
        editRecord.resource_id,
        requestData
      );

      console.log("✅ API Response:", JSON.stringify(response, null, 2));

      if (response?.success) {
        message.success("✅ แก้ไขทรัพยากรสำเร็จ!");

        setDataSource((prev) =>
          prev.map((item) =>
            item.resource_id === editRecord.resource_id
              ? { ...item, ...values }
              : item
          )
        );

        setHistoryData((prev) =>
          prev.map((item) =>
            item.username === editRecord.username
              ? {
                  ...item,
                  ...values,
                  history: `แก้ไขทรัพยากร ${values.resource_name}`,
                }
              : item
          )
        );

        await fetchResources();
        setIsEditModalVisible(false);
        form.resetFields();
      } else {
        await fetchResources();
        message.success("แก้ไขทรัพยากรสำเร็จ!");
        setIsEditModalVisible(false);
      }
    } catch (error) {
      console.error("❌ แก้ไขทรัพยากรผิดพลาด:", error);
      message.error("❌ ไม่สามารถแก้ไขทรัพยากรได้");
    }
  };

  // Add new resource
  const handleAddResource = async () => {
    try {
      const values = await formAdd.validateFields();
      console.log("📢 เพิ่มทรัพยากร:", values);

      if (
        !values.resource_name ||
        !values.quantity ||
        !values.category ||
        !values.username
      ) {
        message.error("❌ โปรดกรอกข้อมูลให้ครบถ้วน");
        return;
      }

      const requestData = {
        resource_name: values.resource_name.trim(),
        quantity: Number(values.quantity),
        unit: values.category.trim(),
      };

      console.log(
        "📢 ข้อมูลที่กำลังส่งไป API:",
        JSON.stringify(requestData, null, 2)
      );

      const response = await createResource(requestData);

      console.log("✅ API Response:", JSON.stringify(response, null, 2));

      if (response) {
        message.success("✅ เพิ่มทรัพยากรสำเร็จ!");

        fetchResources();
        setIsAddResourceModalVisible(false);
        formAdd.resetFields();
      } else {
        console.error("⚠️ API Error Response:", response);
        message.error("⚠️ มีบางอย่างผิดพลาดในการเพิ่มทรัพยากร");
      }
    } catch (error) {
      console.error("❌ Error creating resource:", error);
      message.error("❌ ไม่สามารถเพิ่มทรัพยากรได้");
    }
  };

  // Show edit modal
  const showEditModal = (record) => {
    setEditRecord(record);
    form.resetFields();
    form.setFieldsValue({
      resource_name: record.resource_name,
      unit: record.unit,
      quantity: record.quantity,
      users: record.username,
    });
    setIsEditModalVisible(true);
  };

  // Fetch resource history
  const fetchResourceHistory = async () => {
    try {
      const data = await getAllResourcesProject();
      console.log("📦 ประวัติการเบิกทรัพยากรจาก API:", data);

      const formattedData = Array.isArray(data)
        ? data.flatMap((item, index) =>
            item.resource.map((res, resourceIndex) => {
              const formattedItem = {
                key: `${index}-${resourceIndex}`,
                allocated_by: item.allocated_by || undefined,
                project_name: item.project_name || undefined,
                resource_name: res.resource_name || undefined,
                unit: res.unit || undefined,
                quantity: res.used_quantity || undefined,
              };

              return Object.fromEntries(
                Object.entries(formattedItem).filter(
                  ([key, value]) => value !== undefined
                )
              );
            })
          )
        : [];

      setHistoryData(formattedData);
    } catch (error) {
      console.error("❌ ดึงข้อมูลประวัติการเบิกล้มเหลว:", error);
      message.error("❌ ไม่สามารถโหลดประวัติการเบิกทรัพยากรได้");
    }
  };

  // Filter resources based on search text
  const filteredDataSource = dataSource.filter(
    (item) =>
      item.resource_name &&
      item.resource_name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table columns for resources
  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "index",
      render: (_, __, index) => index + 1,
      
    },
    {
      title: "ชื่อทรัพยากร",
      dataIndex: "resource_name",
     
    },
    {
      title: "หมวดหมู่",
      dataIndex: "unit",
     
    },
    {
      title: "จำนวน",
      dataIndex: "quantity",
      
    },

    ...(role !== "manager" && role !== "user"
      ? [
          {
            title: "จัดการ",
           
            render: (_, record) => (
              <Space>
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
              </Space>
            ),
          },
        ]
      : []),
  ];

  // Table columns for history
  const historyColumns = [
    {
      title: "ชื่อผู้ใช้",
      dataIndex: "allocated_by",
     
    },
    {
      title: "โครงการ",
      dataIndex: "project_name",
     
    },
    {
      title: "เบิกทรัพยากร",
      dataIndex: "resource_name",
     
    },
    {
      title: "หมวดหมู่",
      dataIndex: "unit",
     
    },
    {
      title: "จำนวน",
      dataIndex: "quantity",
      
    },
  ];

  return (
    <Layout sclassName="min-h-screen flex">
      {/* Sidebar - Fixed position */}
      <Sider width={220} className="hidden lg:block">
        <Sidebar />
      </Sider>

      <Layout>
        <Header title="รายการทรัพยากร" />

        <Content className="projectResource-container">
          {/* Responsive Search and Action Buttons */}
          <Row gutter={[16, 16]} className="search-actions-row">
            <Col xs={24} sm={12} md={8} lg={6}>
              <Input
                placeholder="ค้นหารายการทรัพยากร"
                prefix={<SearchOutlined />}
                className="search-input"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>
            <Col
              xs={24}
              sm={12}
              md={16}
              lg={18}
              className="action-buttons-container"
            >
              <Space wrap>
                {role === "admin" && (
                  <>
                    <Button
                      type="primary"
                      icon={<ImportOutlined />}
                      onClick={showModal}
                      className="button"
                    >
                      เบิกทรัพยากร
                    </Button>

                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={showAddResourceModal}
                      className="button"
                    >
                      เพิ่มทรัพยากร
                    </Button>
                  </>
                )}
              </Space>
            </Col>
          </Row>

          {/* Resource Table */}
          <div className="table-container">
            <Table
              columns={columns}
              dataSource={filteredDataSource}
              pagination={{
                pageSize: 6,
                showSizeChanger: false,
                responsive: true,
              }}
              className="resource-table"
              loading={loading}
              bordered
              scroll={{ x: "max-content" }}
            />
          </div>
        </Content>

        {/* History Table */}
        <Content className="projectResource-container">
          <Typography.Text strong className="section-title">
            ประวัติการเบิกทรัพยากร
          </Typography.Text>

          <div className="table-container">
            <Table
              columns={historyColumns}
              dataSource={historyData}
              pagination={{
                pageSize: 5,
                showSizeChanger: false,
                responsive: true,
              }}
              className="resource-table"
              loading={loading}
              bordered
              scroll={{ x: "max-content" }}
            />
          </div>
        </Content>

        {/* Modals */}
        {/* 1. Resource Request Modal */}
        <Modal
          title="เบิกทรัพยากร"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width="auto"
          maxWidth={600}
          centered
        >
          <Form
            form={form}
            onFinish={handleForm}
            layout="vertical"
            onValuesChange={(changedValues) => {
              if (changedValues.resource_name) {
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
              name="allocated_by"
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

            <Form.Item
              label="เบิก"
              name="resource_name"
              rules={[
                { required: true, message: "กรุณากรอกข้อมูลในกล่องข้อความ" },
              ]}
            >
              <Input placeholder="กรุณากรอกข้อมูลที่ต้องการเบิก" />
            </Form.Item>

            <Form.Item
              label="เบิก"
              name="unit"
              rules={[{ required: true, message: "กรุณาเลือกสรรพนามสิ่งของ" }]}
            >
              <Select placeholder="เลือกสรรพนามสิ่งของ">
                {categoryOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="จำนวน"
              name="used_quantity"
              rules={[{ required: true, message: "กรุณากรอกจำนวน" }]}
            >
              <Input type="number" placeholder="จำนวน" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {editRecord ? "บันทึกการแก้ไข" : "ขอนุมัติ"}
                </Button>
                <Button onClick={handleCancel}>ยกเลิก</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* 2. Add Resource Modal */}
        <Modal
          title="เพิ่มทรัพยากร"
          open={isAddResourceModalVisible}
          onCancel={handleCancelAddResource}
          footer={null}
          width="auto"
          maxWidth={600}
          centered
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
                {categoryOptions.map((option) => (
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
              <Space>
                <Button type="primary" htmlType="submit">
                  เพิ่ม
                </Button>
                <Button onClick={handleCancelAddResource}>ยกเลิก</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* 3. Edit Resource Modal */}
        <Modal
          title="แก้ไขทรัพยากร"
          open={isEditModalVisible}
          onCancel={handleCancel}
          footer={null}
          width="auto"
          maxWidth={600}
          centered
        >
          <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
            <Form.Item
              label="ชื่อทรัพยากร"
              name="resource_name"
              rules={[{ required: true, message: "กรุณากรอกชื่อทรัพยากร" }]}
            >
              <Input placeholder="ระบุชื่อทรัพยากร" />
            </Form.Item>

            <Form.Item
              label="หมวดหมู่"
              name="unit"
              rules={[{ required: true, message: "กรุณาเลือกหมวดหมู่" }]}
            >
              <Select placeholder="เลือกหมวดหมู่">
                {categoryOptions.map((option) => (
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
              <Space>
                <Button type="primary" htmlType="submit">
                  บันทึกการแก้ไข
                </Button>
                <Button onClick={handleCancel}>ยกเลิก</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        <Footer />
      </Layout>
    </Layout>
  );
};

export default ProjectResource;
