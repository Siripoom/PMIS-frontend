import { Layout, Card, List, Typography, Table, Badge, Button } from "antd";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { RightOutlined, BellFilled, BellOutlined, InfoCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import "../../styles/Notification.css";

const { Sider, Content } = Layout;

// ข้อมูลแจ้งเตือนล่าสุด
const notifications = [
  { id: 1, text: "Andi Restu (CEO) sent you a message", time: "07:00 AM", unread: true },
  { id: 2, text: "[Reminder] Enter new employee data in system", time: "Yesterday, 04:00 PM", unread: true },
  { id: 3, text: "Salary payments have been received by all employees", time: "August 1st 2022", unread: false },
  { id: 4, text: "Marketing division needs new employees", time: "August 1st 2022", unread: false },
  { id: 5, text: "[Reminder] Report payroll data for July 2022", time: "August 1st 2022", unread: false },
  { id: 6, text: "New employee documents must be updated", time: "August 1st 2022", unread: false },
];

// ข้อมูลการแจ้งเตือนความก้าวหน้าโครงการ
const projectNotifications = [
  { key: 1, icon: <BellFilled style={{ color: "red" }} />, username: "pickupza55", role: "Manager", status: "ดำเนินการ", statusColor: "blue" },
  { key: 2, icon: <BellFilled style={{ color: "red" }} />, username: "pickupOO", role: "Manager", status: "ดำเนินการ", statusColor: "blue" },
  { key: 3, icon: <BellFilled style={{ color: "red" }} />, username: "pickupza55", role: "Manager", status: "ดำเนินการ", statusColor: "blue" },
  { key: 4, icon: <BellOutlined style={{ color: "gray" }} />, username: "pickupOO", role: "Manager", status: "ยกเลิก", statusColor: "red" },
  { key: 5, icon: <BellOutlined style={{ color: "gray" }} />, username: "phalat01", role: "Admin", status: "ดำเนินการเสร็จสิ้น", statusColor: "green" },
];

// ข้อมูลสถานะการแจ้งเตือน
const notificationSummary = [
  { label: "อ่านแล้ว", count: 8, icon: <InfoCircleOutlined /> },
  { label: "ยังไม่อ่าน", count: 2, icon: <InfoCircleOutlined /> },
  { label: "ลบ", count: 0, icon: <DeleteOutlined /> },
];

const Notification = () => {
  // คอลัมน์ของตารางแจ้งเตือนความก้าวหน้าโครงการ
  const columns = [
    { title: "", dataIndex: "icon", key: "icon" },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <span>
          <Badge color={record.statusColor} /> {text}
        </span>
      ),
    },
    {
      title: "",
      key: "action",
      render: () => (
        <a href="#" className="delete-link">
          ลบ <InfoCircleOutlined style={{ fontSize: "12px" }} />
        </a>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      {/* Sidebar */}
      <Sider width={220} style={{ background: "#001529" }}>
        <Sidebar />
      </Sider>

      <Layout>
        <Header title="Notification" />

        <Content className="notification-page">
          <div className="notification-container">
            {/* การแจ้งเตือนล่าสุด */}
            <Card className="notification-card">
              <div className="notification-header">
                <Typography.Title level={4}>การแจ้งเตือนล่าสุด</Typography.Title>
                <a href="/notifications" className="view-all">
                  View All <RightOutlined />
                </a>
              </div>

              <List
                dataSource={notifications}
                renderItem={(item) => (
                  <List.Item className={`notification-item ${item.unread ? "unread" : ""}`}>
                    <div className="notification-content">
                      {item.unread && <span className="dot" />}
                      <Typography.Text strong={item.unread}>{item.text}</Typography.Text>
                    </div>
                    <Typography.Text className="notification-time">{item.time}</Typography.Text>
                  </List.Item>
                )}
              />
            </Card>

            {/* กล่องล่าง: การแจ้งเตือนโครงการ + สถานะแจ้งเตือน */}
            <div className="notification-bottom">
              {/* การแจ้งเตือนความก้าวหน้าโครงการ (ซ้ายล่าง) */}
              <Card className="project-notification-card">
                <div className="notification-header">
                  <Typography.Title level={4} className="notification-title">
                    การแจ้งเตือนความก้าวหน้าโครงการ
                  </Typography.Title>
                  <a href="/project-updates" className="view-all">
                    View All <RightOutlined />
                  </a>
                </div>
                <Table columns={columns} dataSource={projectNotifications} pagination={false} />
              </Card>

              {/* กล่องสรุปสถานะการแจ้งเตือน (ขวาล่าง) */}
              <Card className="notification-summary-card">
                <Typography.Title level={4} className="notification-title">
                  สถานะการแจ้งเตือน •
                </Typography.Title>
                {notificationSummary.map((item, index) => (
                  <div className="notification-summary-item" key={index}>
                    <span>{item.icon} {item.label}</span>
                    <span>{item.count}</span>
                  </div>
                ))}
                <Button type="primary" className="view-more-button">
                  View More
                </Button>
              </Card>
            </div>
          </div>
        </Content>

        <Footer />
      </Layout>
    </Layout>
  );
};

export default Notification;
