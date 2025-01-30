import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "./StationsTable.css";
import {
  getStations,
  getStationById,
  createStation,
  updateStation,
  deleteStation,
} from "../api/stations";

const { Option } = Select;

const StationsTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStations();
  }, []);
  // ดึงข้อมูลสถานีจาก API
  const fetchStations = async () => {
    setLoading(true);
    try {
      const response = await getStations();
      console.log(response.stations);
      setData(response.stations); // ต้องใช้ key=id
    } catch (error) {
      message.error("ไม่สามารถโหลดข้อมูลสถานีได้");
    }
    setLoading(false);
  };

  // เปิด Modal (เพิ่ม / แก้ไข)
  const showModal = async (record = null) => {
    if (record) {
      try {
        const stationData = await getStationById(record.key);
        setEditingItem(stationData);
        form.setFieldsValue(stationData);
      } catch (error) {
        message.error("ไม่สามารถโหลดข้อมูลสถานีได้");
      }
    } else {
      setEditingItem(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // ปิด Modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // บันทึกข้อมูล (เพิ่ม / แก้ไข)
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingItem) {
        await updateStation(editingItem.key, values);
        message.success("แก้ไขข้อมูลสำเร็จ!");
      } else {
        console.log("Add new item:", values);
        await createStation(values);
        message.success("เพิ่มข้อมูลสำเร็จ!");
      }
      fetchStations(); // โหลดข้อมูลใหม่
      handleCancel();
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  // ลบข้อมูล
  const handleDelete = (key) => {
    Modal.confirm({
      title: "คุณแน่ใจหรือไม่?",
      content: "ข้อมูลจะถูกลบถาวร",
      okText: "ลบ",
      okType: "danger",
      cancelText: "ยกเลิก",
      onOk: async () => {
        try {
          await deleteStation(key);
          message.success("ลบข้อมูลสำเร็จ!");
          fetchStations();
        } catch (error) {
          message.error("เกิดข้อผิดพลาดในการลบข้อมูล");
        }
      },
    });
  };

  // คอลัมน์ของตาราง
  const columns = [
    {
      title: "ชื่อสถานี",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "ประเภท",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "การจัดการ",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            แก้ไข
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
          >
            ลบ
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="stations-container">
      {/* ปุ่มเพิ่มข้อมูล */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">รายการสถานีระบายน้ำ</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          เพิ่มข้อมูล
        </Button>
      </div>

      {/* ตารางข้อมูล */}
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Modal (เพิ่ม / แก้ไข) */}
      <Modal
        title={editingItem ? "แก้ไขข้อมูลสถานี" : "เพิ่มข้อมูลสถานี"}
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSave}
        okText={editingItem ? "บันทึกการแก้ไข" : "เพิ่มข้อมูล"}
        cancelText="ยกเลิก"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="ชื่อสถานี"
            rules={[{ required: true, message: "กรุณากรอกชื่อสถานี" }]}
          >
            <Input placeholder="กรอกชื่อสถานี" />
          </Form.Item>
          <Form.Item
            name="type"
            label="ประเภท"
            rules={[{ required: true, message: "กรุณาเลือกประเภท" }]}
          >
            <Select placeholder="เลือกประเภท">
              <Option value="ถนน">ถนน</Option>
              <Option value="อุโมงค์">อุโมงค์</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StationsTable;
