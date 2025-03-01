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
} from "../../api/ProjectManage";

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
      if (Array.isArray(data)) {
        setProjects(data);
      } else {
        console.error("❌ API ไม่ส่งข้อมูลโครงการในรูปแบบที่คาดหวัง:", data);
      }
    } catch (error) {
      console.error("❌ Error fetching projects:", error);
      message.error("โหลดข้อมูลโครงการล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
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
    setIsModalVisible(false);
    setIsEditModalVisible(false);
  };

  const handleAddProject = async (values) => {
    try {
      console.log("📢 Creating project:", values);

      if (!values.project_name || !values.budget || !values.status) {
        message.error("กรุณากรอกข้อมูลให้ครบถ้วน!");
        return;
      }

      const newProject = await createProject(values);
      console.log("✅ Project Created:", newProject);

      if (newProject) {
        setProjects((prevProjects) => [...prevProjects, newProject]); // ✅ อัปเดต state ทันที
        message.success("เพิ่มโครงการสำเร็จ!");
        handleCancel();
      } else {
        message.error("เกิดข้อผิดพลาดในการเพิ่มโครงการ");
      }
    } catch (error) {
      console.error("❌ Error adding project:", error);
      message.error(
        error.response?.data?.error || "เกิดข้อผิดพลาดในการเพิ่มโครงการ"
      );
    }
  };

  const handleEditProject = async (values) => {
    try {
      console.log("📢 Updating project:", editData.project_id, values);
      const updatedProject = await updateProject(editData.project_id, values);
      console.log("✅ Project Updated:", updatedProject);

      if (updatedProject) {
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.project_id === updatedProject.project_id
              ? updatedProject
              : project
          )
        );
        message.success("แก้ไขโครงการสำเร็จ!");
        handleCancel();
      } else {
        message.error("เกิดข้อผิดพลาดในการแก้ไขโครงการ");
      }
    } catch (error) {
      console.error("❌ Error editing project:", error);
      message.error(
        error.response?.data?.error || "เกิดข้อผิดพลาดในการแก้ไขโครงการ"
      );
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      console.log("📢 Deleting project ID:", id);
      await deleteProject(id);
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.project_id !== id)
      );
      message.success("ลบโครงการสำเร็จ!");
    } catch (error) {
      console.error("❌ Error deleting project:", error);
      message.error(
        error.response?.data?.error || "เกิดข้อผิดพลาดในการลบโครงการ"
      );
    }
  };

  const columns = [
    { title: "เลือก", dataIndex: "select", render: () => <Checkbox /> },
    { title: "ชื่อโครงการ", dataIndex: "project_name" },
    { title: "รายละเอียด", dataIndex: "description" },
    { title: "งบประมาณ", dataIndex: "budget" },
    { title: "สถานะ", dataIndex: "status" },
    {
      title: "วันเริ่มต้น",
      dataIndex: "start_date",
      render: (text) => (text ? text.split("T")[0] : ""),
    },
    {
      title: "จัดการ",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteProject(record.project_id)}
          />
        </div>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      <Sider width={220}>
        <Sidebar />
      </Sider>
      <Layout>
        <Header title="Project Management" />
        <Content className="p-6 bg-gray-100">
          <div className="bg-white p-4 shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">การจัดการโครงการ</h2>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showModal}
              >
                เพิ่มโครงการ
              </Button>
            </div>
            {loading ? (
              <Spin size="large" />
            ) : (
              <Table
                columns={columns}
                dataSource={projects}
                rowKey="project_id"
                pagination={{ pageSize: 5 }}
              />
            )}
          </div>
        </Content>

        <Modal
          title={isEditModalVisible ? "แก้ไขโครงการ" : "เพิ่มโครงการ"}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            layout="vertical"
            form={form}
            onFinish={isEditModalVisible ? handleEditProject : handleAddProject}
          >
            <Form.Item
              label="ชื่อโครงการ"
              name="project_name"
              rules={[{ required: true, message: "กรุณากรอกชื่อโครงการ" }]}
            >
              <Input placeholder="ระบุชื่อโครงการ" />
            </Form.Item>
            <Form.Item label="รายละเอียด" name="description">
              <Input.TextArea placeholder="รายละเอียดโครงการ" />
            </Form.Item>
            <Form.Item
              label="งบประมาณ"
              name="budget"
              rules={[{ required: true, message: "กรุณาระบุงบประมาณ" }]}
            >
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
              <Button type="primary" htmlType="submit">
                บันทึก
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Footer />
      </Layout>
    </Layout>
  );
};

export default ProjectManagement;
