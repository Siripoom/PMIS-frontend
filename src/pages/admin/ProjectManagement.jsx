import {
  Layout,
  Table,
  Checkbox,
  Button,
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import "../../styles/ProjectManagement.css";

const { Sider, Content } = Layout;
const { Option } = Select;

const mockData = [
  {
    key: "1",
    creator: "นายวิทสิริ สุขหวาน",
    project: "การดำเนินการติดตั้ง",
    details: "รายละเอียดของโครงการ",
    document: "📄",
    status: "รออนุมัติ",
    dateTime: "2017-10-31 23:12:00",
  },
  {
    key: "2",
    creator: "นายปิ๊คอัพ คนบ้านนา",
    project: "ขอความร่วมมือ",
    details: "รายละเอียดของโครงการ",
    document: "📄",
    status: "อนุมัติแล้ว",
    dateTime: "2017-10-31 24:15:00",
  },
];

const ProjectManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editData, setEditData] = useState(null);

  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditData(record);
    form.setFieldsValue(record);
    setIsEditModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEditModalVisible(false);
  };

  const columns = [
    {
      title: "เลือก",
      dataIndex: "select",
      render: () => <Checkbox />,
    },
    {
      title: "ชื่อผู้สร้าง",
      dataIndex: "creator",
    },
    {
      title: "ชื่อโครงการ",
      dataIndex: "project",
    },
    {
      title: "เอกสาร",
      dataIndex: "document",
    },
    {
      title: "สถานะ",
      dataIndex: "status",
    },
    {
      title: "วัน-เวลา",
      dataIndex: "dateTime",
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
          <Button type="text" icon={<DeleteOutlined />} />
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
        <Header title="Project Management" />
        <Content className="p-6 bg-gray-100">
          <div className="bg-white p-4 shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">การจัดการโครงการ</h2>
              <Button type="primary" onClick={showModal}>
                เพิ่มโครงการ
              </Button>
            </div>
            <Table
              columns={columns}
              dataSource={mockData}
              pagination={{ pageSize: 5 }}
            />
          </div>
        </Content>
      </Layout>

      {/* Modal for Adding and Editing Project */}
      <Modal
        title={isEditModalVisible ? "แก้ไขโครงการ" : "เพิ่มโครงการ"}
        visible={isModalVisible || isEditModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Username" name="creator">
            <Input placeholder="บัญชีสำหรับรับผิดชอบโครงการ" />
          </Form.Item>
          <Form.Item label="ชื่อโครงการ" name="project">
            <Input placeholder="ระบุชื่อโครงการบันทึก" />
          </Form.Item>
          <Form.Item label="รายละเอียด" name="details">
            <Input.TextArea placeholder="รายละเอียดโครงการ" />
          </Form.Item>
          <Form.Item label="สถานะ" name="status">
            <Select>
              <Option value="ระบุ">ระบุ</Option>
              <Option value="รออนุมัติ">รออนุมัติ</Option>
              <Option value="อนุมัติแล้ว">อนุมัติแล้ว</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary">
              {isEditModalVisible ? "บันทึกการแก้ไข" : "บันทึก"}
            </Button>
            <Button className="ml-2" onClick={handleCancel}>
              ยกเลิก
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default ProjectManagement;
