import { useState, useEffect } from "react";
import { getNotifications } from "../../api/Notifications";
import { getAllProjects, deleteProject} from "../../api/ProjectManage";
import { getAllUsers } from "../../api/userManager";
import { Layout, Card, List, Typography, Table, Badge, Button, message } from "antd";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { RightOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import "../../styles/Notification.css";

const { Sider, Content } = Layout;
const Notification = () => {
  const [projectNotifications, setProjectNotifications] = useState([]);
  const [notificationSummary, setNotificationSummary] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // ✅ โหลดข้อมูลจาก API เมื่อ Component โหลด
  useEffect(() => {
    fetchNotifications();
  }, []);
  
  const fetchNotifications = async () => {
    try {
      console.log("📢 กำลังโหลดข้อมูลการแจ้งเตือน...");
      
      // ดึงข้อมูลแจ้งเตือนจาก API
      const data = await getNotifications();
  
      console.log("✅ API Response:", data);
  
      if (!data || !Array.isArray(data)) {
        console.error("❌ API ส่งข้อมูลผิดโครงสร้าง:", data);
        throw new Error("❌ ข้อมูล API ไม่ถูกต้อง");
      }
  
      // ✅ จัดรูปแบบข้อมูลสำหรับการแสดงผล
      const formattedNotifications = data.map((notif) => ({
        notification_id: notif.notification_id,
        user_id: notif.user_id,
        message: notif.message,
        status: notif.status,
        created_at: notif.created_at,
      }));
  
      setNotifications(formattedNotifications);
      console.log("✅ โหลดข้อมูลสำเร็จ:", formattedNotifications);
    } catch (error) {
      console.error("❌ เกิดข้อผิดพลาดขณะโหลดข้อมูลแจ้งเตือน:", error);
      message.error("โหลดข้อมูลการแจ้งเตือนไม่สำเร็จ");
    }
  };
  
  
// ✅ ฟังก์ชันดึงข้อมูลการแจ้งเตือนความก้าวหน้าโครงการใส่ตารางกา
useEffect(() => {
  fetchProjectNotifications();
}, []);

// ฟังก์ชันดึงข้อมูลการแจ้งเตือนโครงการจาก API
// 🔹 ดึงข้อมูล Project ทั้งหมด
const fetchProjectData = async () => {
  try {
    const projects = await getAllProjects();
    if (!Array.isArray(projects)) {
      throw new Error("ข้อมูลโครงการไม่ใช่ array");
    }
    return projects;
  } catch (error) {
    console.error("❌ Error fetching project data:", error);
    return [];
  }
};

// 🔹 ดึงข้อมูล User ทั้งหมด
const fetchUserData = async () => {
  try {
    const rawUsers = await getAllUsers();
    const users = Array.isArray(rawUsers.data)
      ? rawUsers.data
      : [];
    

    return users;
  } catch (error) {
    console.error("❌ Error fetching user data:", error);
    return [];
  }
};

const fetchProjectNotifications = async () => {
  try {
    const [projects, usersRaw] = await Promise.all([
      fetchProjectData(),
      fetchUserData()
    ]);

    const users = Array.isArray(usersRaw)
      ? usersRaw
      : usersRaw?.users || [];

    // ✅ ผู้ใช้ที่ไม่มีโครงการ
    const usersWithoutProjects = users.filter(
      (user) => !projects.some((project) => project.created_by === user.user_id)
    );

    // ✅ ผู้ใช้ที่มีโครงการ
    const formattedWithProject = projects.map((project, index) => {
      const matchedUser = users.find((u) => u.user_id === project.created_by);
      return {
        key: project.id || index,
        projectId: project.id || "-",
        projectName: project.name || "-",
        username: matchedUser?.username || "ไม่พบผู้ใช้",
        role: matchedUser?.role || "-",
        status: project.status || "ไม่ระบุสถานะ",
        notification_id: project.id // สำหรับลบ
      };
    });

    // ✅ เพิ่มผู้ใช้ที่ไม่มีโครงการ
    const formattedWithoutProject = usersWithoutProjects.map((user, index) => ({
      key: `no-project-${index}`,
      projectId: "-",
      projectName: "ไม่มีโครงการ",
      username: user.username,
      role: user.role,
      status: "ไม่มีโครงการ",
      notification_id: null
    }));

    // 🔗 รวมทั้งหมดเข้าด้วยกัน
    const allFormatted = [...formattedWithProject, ...formattedWithoutProject];
    setProjectNotifications(allFormatted);

  } catch (error) {
    console.error("❌ Error fetching project notifications:", error);
    message.error("โหลดข้อมูลการแจ้งเตือนโครงการไม่สำเร็จ");
  }
};

  // ✅ ฟังก์ชันแปลง `created_at` เป็นรูปแบบที่อ่านง่าย
  const formatDate = (dateString) => {
    const date = moment(dateString);
    if (date.isSame(moment(), "day")) {
      return date.format("hh:mm A"); // วันนี้ → 07:00 AM
    } else if (date.isSame(moment().subtract(1, "day"), "day")) {
      return `Yesterday, ${date.format("hh:mm A")}`; // เมื่อวาน → Yesterday, 04:00 PM
    } else {
      return date.format("MMMM Do YYYY"); // วันที่เก่า → August 1st 2022
    }
  };

  // ✅ คอลัมน์ของตารางแจ้งเตือนความก้าวหน้าโครงการ
  

  

  const columns1 = [
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <span>
          <Badge color={record.statusColor || "blue"} /> {text}
        </span>
      ),
    },
  ];
  
  
  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      <Sider width={220} style={{ background: "#001529" }}>
        <Sidebar />
      </Sider>

      <Layout>
        <Header title="Notification" />

        <Content className="notification-page">
          <div className="notification-container">
            {/* 🔹 การแจ้งเตือนล่าสุด */}
            <Card className="notification-card">
              <Typography.Title level={4}>การแจ้งเตือนล่าสุด</Typography.Title>

              {notifications.length === 0 ? (
                <Typography.Text type="secondary">ไม่มีการแจ้งเตือน</Typography.Text>
              ) : (
                <List
                  dataSource={notifications}
                  renderItem={(item) => (
                    <List.Item
                      className={`notification-item ${
                        item.status === "Unread" ? "unread" : ""
                      }`}
                    >
                      {/* 🔹 จุดสถานะ Unread */}
                      {item.status === "Unread" && (
                        <Badge color="blue" style={{ marginRight: "10px" }} />
                      )}

                      {/* 🔹 ข้อความแจ้งเตือน */}
                      <div className="notification-content">
                        <Typography.Text strong={item.status === "Unread"}>
                          {item.message}
                        </Typography.Text>
                      </div>

                      {/* 🔹 เวลา */}
                      <Typography.Text className="notification-time">
                        {formatDate(item.created_at)}
                      </Typography.Text>

                      {/* 🔹 ปุ่มลูกศรขวา */}
                      <Button type="link" icon={<RightOutlined />} />
                    </List.Item>
                  )}
                />
              )}
            </Card>

            {/* 🔹 กล่องล่าง: การแจ้งเตือนโครงการ + สถานะแจ้งเตือน */}
            <div className="notification-bottom">
              {/* 🔹 การแจ้งเตือนความก้าวหน้าโครงการ */}
              <Card className="project-notification-card">
              <div className="notification-header">
                <Typography.Title level={4} className="notification-title">
                  การแจ้งเตือนความก้าวหน้าโครงการ
                </Typography.Title>
                <a href="/project-updates" className="view-all">
                  View All <RightOutlined />
                </a>
              </div>

              {projectNotifications.length === 0 ? (
                <Typography.Text type="secondary">
                  ไม่มีข้อมูลการแจ้งเตือน
                </Typography.Text>
              ) : (
                <Table
                  columns={columns1}
                  dataSource={projectNotifications}
                  pagination={false}
                />
              )}
            </Card>

              {/* 🔹 กล่องสรุปสถานะการแจ้งเตือน */}
              <Card className="notification-summary-card">
                <Typography.Title level={4} className="notification-title">
                  สถานะการแจ้งเตือน
                </Typography.Title>

                {notificationSummary.length === 0 ? (
                  <Typography.Text type="secondary">ไม่มีข้อมูลสถานะ</Typography.Text>
                ) : (
                  notificationSummary.map((item, index) => (
                    <div className="notification-summary-item" key={index}>
                      <span>
                        {item.icon} {item.label}
                      </span>
                      <span>{item.count}</span>
                    </div>
                  ))
                )}

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