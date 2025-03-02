import {
  Layout,
  Table,
  Checkbox,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Spin,
} from "antd";
import { useState, useEffect } from "react";
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
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
  const [modalState, setModalState] = useState({ visible: false, edit: false, data: null });
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

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
    form.resetFields();
    setFileList([]); // รีเซ็ตไฟล์แนบ
    setModalState({ visible: true, edit: false, data: null });
  };

  const showEditModal = (record) => {
    console.log("📢 เปิด Modal แก้ไขโครงการ:", record);
    setModalState({ visible: true, edit: true, data: record });
  
    // ตั้งค่าข้อมูลเดิมในฟอร์ม
    form.setFieldsValue({
      username: record.username,
      project_name: record.project_name,
      description: record.description,
      budget: record.budget,
      status: record.status,
      start_date: record.start_date ? record.start_date.split("T")[0] : "",
      end_date: record.end_date ? record.end_date.split("T")[0] : ""
    });
  };
  

  const handleCancel = () => {
    setModalState({ visible: false, edit: false, data: null });
    setFileList([]); // รีเซ็ตไฟล์เมื่อปิด Modal
  };

  const handleAddProject = async (values) => {
    try {
      console.log("📢 Creating project:", values, "📂 Files:", fileList);
      const newProject = await createProject(values);
      setProjects((prevProjects) => [...prevProjects, newProject]);
      message.success("เพิ่มโครงการสำเร็จ!");
      handleCancel();
    } catch (error) {
      console.error("❌ Error adding project:", error);
      message.error("เพิ่มโครงการไม่สำเร็จ");
    }
  };
  const handleEditProject = async (values) => {
    try {
      console.log("📢 Updating project:", modalState.data.project_id, values);
      const updatedProject = await updateProject(modalState.data.project_id, values);
      
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.project_id === updatedProject.project_id ? updatedProject : project
        )
      );

      message.success("แก้ไขโครงการสำเร็จ!");
      handleCancel();
    } catch (error) {
      console.error("❌ Error editing project:", error);
      message.error("แก้ไขโครงการไม่สำเร็จ");
    }
  };
  const handleFileChange = ({ fileList }) => {
    console.log("📂 อัปโหลดไฟล์:", fileList);
    setFileList(fileList);
  };

  const columns = [
  { title: "เลือก", dataIndex: "select", render: () => <Checkbox /> },
  { title: "Username", dataIndex: "username" }, 
  { title: "ชื่อโครงการ", dataIndex: "project_name" },
  { title: "รายละเอียด", dataIndex: "description" },
  { title: "งบประมาณ (บาท)", dataIndex: "budget", render: (text) => text?.toLocaleString() + " บาท" }, 
  { title: "สถานะ", dataIndex: "status" },
  { 
    title: "วันที่เริ่มต้น", 
    dataIndex: "start_date", 
    render: (text) => (text ? text.split("T")[0] : "ไม่ระบุ") 
  },
  { 
    title: "วันที่สิ้นสุด", 
    dataIndex: "end_date",  
    render: (text) => (text ? text.split("T")[0] : "ไม่ระบุ") 
  },
  { 
    title: "เอกสารแนบ",
    dataIndex: "document",
    render: (file) => file ? <a href={file} target="_blank" rel="noopener noreferrer">เปิดไฟล์</a> : "ไม่มีไฟล์"
  },
  {
    title: "จัดการ",
    render: (_, record) => (
      <div className="flex space-x-2">
        {/* ปุ่มแก้ไข */}
        <Button 
          type="text" 
          icon={<EditOutlined />} 
          onClick={() => showEditModal(record)} 
        />
        
        {/* ปุ่มลบ พร้อม Confirm */}
        <Button 
          type="text" 
          icon={<DeleteOutlined />} 
          danger
          onClick={() => confirmDelete(record.project_id)} 
        />
      </div>
    ),
  },
];
  
const confirmDelete = (projectId) => {
  Modal.confirm({
    title: "ยืนยันการลบ",
    content: "คุณแน่ใจหรือไม่ว่าต้องการลบโครงการนี้?",
    okText: "ลบ",
    okType: "danger",
    cancelText: "ยกเลิก",
    onOk: () => handleDeleteProject(projectId),
  });
};

const handleDeleteProject = async (id) => {
  try {
    console.log("📢 Deleting project ID:", id);
    await deleteProject(id);
    setProjects((prevProjects) => prevProjects.filter((project) => project.project_id !== id));
    message.success("ลบโครงการสำเร็จ!");
  } catch (error) {
    console.error("❌ Error deleting project:", error);
    message.error("ลบโครงการไม่สำเร็จ");
  }
};

  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      <Sider width={220}><Sidebar /></Sider>
      <Layout>
        <Header title="Project Management" />
        <Content className="p-6 bg-gray-100">
          <div className="bg-white p-4 shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">การจัดการโครงการ</h2>
              <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>เพิ่มโครงการ</Button>
            </div>
            {loading ? <Spin size="large" /> : <Table columns={columns} dataSource={projects} rowKey="project_id" pagination={{ pageSize: 5 }} />}
          </div>
        </Content>
        <Modal title={modalState.edit ? "แก้ไขโครงการ" : "เพิ่มโครงการ"} open={modalState.visible} onCancel={handleCancel} footer={null}>
  <Form layout="vertical" form={form} onFinish={modalState.edit ? handleEditProject : handleAddProject}>
    
    {/* Username */}
    <Form.Item label="Username" name="username" rules={[{ required: true, message: "กรุณากรอกบัญชีสำหรับรับผิดชอบโครงการ" }]}>
      <Input placeholder="บัญชีสําหรับรับผิดชอบโครงการ" />
    </Form.Item>

    {/* ชื่อโครงการ */}
    <Form.Item label="ชื่อโครงการ" name="project_name" rules={[{ required: true, message: "กรุณากรอกชื่อโครงการ" }]}>
      <Input placeholder="ระบุชื่อโครงการฉบับเต็ม" />
    </Form.Item>

    {/* รายละเอียด */}
    <Form.Item label="รายละเอียด" name="description">
      <Input.TextArea placeholder="รายละเอียดโครงการ" />
    </Form.Item>

    {/* งบประมาณ (ใหม่!) */}
    <Form.Item label="งบประมาณ" name="budget" rules={[{ required: true, message: "กรุณากรอกงบประมาณ" }]}>
      <Input type="number" placeholder="ระบุงบประมาณ (บาท)" />
    </Form.Item>

    {/* สถานะ */}
    <Form.Item label="สถานะ" name="status">
      <Select placeholder="ระบุสถานะ">
        <Option value="Planned">กําลังวางแผน</Option>
        <Option value="In Progress">กําลังดําเนินงาน</Option>
        <Option value="Completed">สําเร็จ</Option>
        <Option value="Delayed">เกินกําหนดการ</Option>
      </Select>
    </Form.Item>

    {/* วันที่เริ่มต้น */}
    <Form.Item label="วันที่เริ่มต้น" name="start_date">
      <Input type="date" />
    </Form.Item>

    {/* วันที่สิ้นสุด */}
    <Form.Item label="วันที่สิ้นสุด" name="end_date">
      <Input type="date" />
    </Form.Item>

    {/* แนบเอกสาร */}
    <Form.Item label="แนบเอกสาร" name="document">
      <Upload
        fileList={fileList}
        beforeUpload={() => false} // ป้องกันการอัปโหลดอัตโนมัติ
        onChange={handleFileChange}
      >
        <Button icon={<UploadOutlined />}>แนบไฟล์</Button>
      </Upload>
    </Form.Item>

    {/* ปุ่มบันทึก & ยกเลิก */}
    <Form.Item>
      <Button type="primary" htmlType="submit">บันทึก</Button>
      <Button style={{ marginLeft: 10 }} onClick={handleCancel}>ยกเลิก</Button>
    </Form.Item>

  </Form>
</Modal>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default ProjectManagement;
