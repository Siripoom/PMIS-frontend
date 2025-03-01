import {
  Layout,
  Table,
  Checkbox,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Spin,
} from "antd";
import { useState, useEffect } from "react";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import "../../styles/ProjectManagement.css";
import Footer from "../../components/Footer/Footer";
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../api/ProjectManage"; // ✅ ใช้ชื่อที่คุณตั้งไว้

const { Sider, Content } = Layout;
const { Option } = Select;

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      console.log("📢 Fetching projects from API...");
      const data = await getAllProjects();
      console.log("✅ API Response:", data);
      setProjects(data);
    } catch (error) {
      console.error("❌ Error fetching projects:", error);
      message.error("โหลดข้อมูลโครงการล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    console.log("📢 กำลังเปิด Modal เพิ่มโครงการ...");
    form.resetFields(); // ✅ รีเซ็ตฟอร์มก่อนแสดง Modal
    setIsModalVisible(true); // ✅ เปิด Modal
  };

  const showEditModal = (record) => {
    console.log("📢 กำลังเปิด Modal แก้ไขโครงการ...");
    setEditData(record);
    form.setFieldsValue({
      project_name: record.project_name,
      description: record.description,
      budget: record.budget,
      status: record.status,
      start_date: record.start_date ? record.start_date.split("T")[0] : "",
    });
    setIsEditModalVisible(true);
  };

  const handleCancel = () => {
    console.log("📢 ปิด Modal");
    setIsModalVisible(false);
    setIsEditModalVisible(false);
  };

  const handleAddProject = async (values) => {
    try {
      console.log("📢 Creating project:", values);
      await createProject(values);
      message.success("เพิ่มโครงการสำเร็จ");
      fetchProjects();
      handleCancel();
    } catch (error) {
      console.error("❌ Error adding project:", error);
      message.error("เพิ่มโครงการไม่สำเร็จ");
    }
  };

  const handleEditProject = async (values) => {
    try {
      console.log("📢 Updating project:", editData.project_id, values);
      await updateProject(editData.project_id, values);
      message.success("แก้ไขโครงการสำเร็จ");
      fetchProjects();
      handleCancel();
    } catch (error) {
      console.error("❌ Error editing project:", error);
      message.error("แก้ไขโครงการไม่สำเร็จ");
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      console.log("📢 Deleting project ID:", id);
      await deleteProject(id);
      message.success("ลบโครงการสำเร็จ");
      fetchProjects();
    } catch (error) {
      console.error("❌ Error deleting project:", error);
      message.error("ลบโครงการไม่สำเร็จ");
    }
  };

  const columns = [
    { title: "เลือก", dataIndex: "select", render: () => <Checkbox /> },
    { title: "ชื่อโครงการ", dataIndex: "project_name" },
    { title: "รายละเอียด", dataIndex: "description" },
    { title: "งบประมาณ", dataIndex: "budget" },
    { title: "สถานะ", dataIndex: "status" },
    { title: "วันเริ่มต้น", dataIndex: "start_date", render: (text) => (text ? text.split("T")[0] : "") },
    {
      title: "จัดการ",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button type="text" icon={<EditOutlined />} onClick={() => showEditModal(record)} />
          <Button type="text" icon={<DeleteOutlined />} onClick={() => handleDeleteProject(record.project_id)} />
        </div>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      <Sider width={220}><Sidebar /></Sider>
      <Layout>
        <Header title="Project Management" />
        <Content className="p-6 bg-gray-100">
          <div className="bg-white p-4 shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">การจัดการโครงการ</h2>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                console.log("📢 กดปุ่มเพิ่มโครงการแล้ว!");
                showModal();
              }}>
                เพิ่มโครงการ
              </Button>
            </div>
            {loading ? (
              <Spin size="large" />
            ) : (
              <Table
                columns={columns}
                dataSource={projects}
                rowKey="project_id" // ✅ ป้องกัน Key Error
                pagination={{ pageSize: 5 }}
              />
            )}
          </div>
        </Content>

        {/* Modal for Adding and Editing Project */}
        <Modal
          title={isEditModalVisible ? "แก้ไขโครงการ" : "เพิ่มโครงการ"}
          open={isModalVisible} 
          onCancel={handleCancel}
          footer={null}
        >
          <Form layout="vertical" form={form} onFinish={isEditModalVisible ? handleEditProject : handleAddProject}>
            <Form.Item label="ชื่อโครงการ" name="project_name" rules={[{ required: true, message: "กรุณากรอกชื่อโครงการ" }]}>
              <Input placeholder="ระบุชื่อโครงการ" />
            </Form.Item>
            <Form.Item label="รายละเอียด" name="description">
              <Input.TextArea placeholder="รายละเอียดโครงการ" />
            </Form.Item>
            <Form.Item label="งบประมาณ" name="budget" rules={[{ required: true, message: "กรุณาระบุงบประมาณ" }]}>
              <Input placeholder="งบประมาณ" type="number" />
            </Form.Item>
            <Form.Item label="สถานะ" name="status">
              <Select>
                <Option value="Planned">Planned</Option>
                <Option value="In Progress">In Progress</Option>
                <Option value="Completed">Completed</Option>
                <Option value="Delayed">Delayed</Option>
              </Select>
            </Form.Item>
            <Form.Item label="วันเริ่มต้น" name="start_date">
              <Input type="date" />
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

export default ProjectManagement;
