import { Layout, Card, List, Avatar, Tag } from "antd";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import "../../styles/ProjectProgress.css";
import Footer from "../../components/Footer/Footer";
import { Chart } from "react-google-charts";
import { getAllProjects} from "../../api/ProjectManage";
import { useEffect, useState } from "react";

const { Sider, Content } = Layout;



const ProjectProgress = () => {
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await getAllProjects();
        setProjectData(projects);
      } catch (error) {
        console.error("❌ Failed to load project data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const columns = [
    { type: "string", label: "Task ID" },
    { type: "string", label: "Task Name" },
    { type: "date", label: "Start Date" },
    { type: "date", label: "End Date" },
    { type: "number", label: "Duration" },
    { type: "number", label: "Percent Complete" },
    { type: "string", label: "Dependencies" },
  ];

  const ganttRows = projectData
    .filter(item => item.start_date && item.end_date)
    .map((item, index) => [
      `Task${index + 1}`,
      item.project_name || `Project ${index + 1}`,
      new Date(item.start_date),
      new Date(item.end_date),
      null,
      0,
      null,
    ]);

  const data = [columns, ...ganttRows];

  const options = {
    height: 400,
    gantt: {
      trackHeight: 30,
      criticalPathEnabled: true,
      criticalPathStyle: {
        stroke: "#e64a19",
        strokeWidth: 2,
      },
      palette: [{ color: "#5e97f6", dark: "#2a56c6", light: "#c9d7f8" }],
    },
    timeline: {
      showRowLabels: true,
      showBarLabels: false,
    },
    hAxis: {
      format: 'MMM d, yyyy',
    },
  };

  const getCardStyle = (status) => {
    const lowerStatus = status?.toLowerCase();
    return {
      backgroundColor:
        lowerStatus === "complete" || lowerStatus === "เสร็จสิ้น"
          ? "#f3e8ff"
          : lowerStatus === "in-progress" || lowerStatus === "กำลังดำเนินการ"
          ? "#e8f5e9"
          : lowerStatus === "delay" || lowerStatus === "ล่าช้า"
          ? "#ffebee"
          : lowerStatus === "todo" || lowerStatus === "ยังไม่เริ่ม"
          ? "#e3f2fd"
          : "#ffffff",
  
      borderLeft:
        lowerStatus === "complete" || lowerStatus === "เสร็จสิ้น"
          ? "6px solid #9c27b0"
          : lowerStatus === "in-progress" || lowerStatus === "กำลังดำเนินการ"
          ? "6px solid #4caf50"
          : lowerStatus === "delay" || lowerStatus === "ล่าช้า"
          ? "6px solid #f44336"
          : lowerStatus === "todo" || lowerStatus === "ยังไม่เริ่ม"
          ? "6px solid #2196f3"
          : "6px solid #d9d9d9",
  
      borderRadius: "12px",
      padding: "16px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
      minHeight: "100px",
    };
  };
  
  

  const getTagColor = (status) => {
    switch (status.toLowerCase()) {
      case "complete":
      case "เสร็จสิ้น":
        return "purple";
      case "in-progress":
      case "กำลังดำเนินการ":
        return "green";
      case "delay":
      case "ล่าช้า":
        return "red";
      case "todo":
      case "ยังไม่เริ่ม":
        return "blue";
      default:
        return "default";
    }
  };
  
  

  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      <Sider width={220} className="lg:block hidden">
        <Sidebar />
      </Sider>

      <Layout>
        <Header title="Project Management" />
        <Content className="projectProgress-container">
          {/* ✅ รายงานความคืบหน้า */}
          <Card title="รายงานความคืบหน้าของโครงการ" style={{ marginBottom: 24 }}>
          <List
  loading={loading}
  grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
  dataSource={projectData}
  renderItem={(item) => (
    <List.Item>
      {/* ✅ ใช้ getCardStyle() อย่างถูกต้อง */}
      <div style={getCardStyle(item.status)}>
        <div style={{ fontWeight: "bold", fontSize: "16px" }}>
          {item.project_name || "No Title"}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <Tag color={getTagColor(item.status)}>
            {item.status || "Unknown"}
          </Tag>
          <span style={{ fontSize: "0.85rem", color: "#555" }}>
            Due: {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-GB") : "-"}
          </span>
        </div>
      </div>
    </List.Item>
  )}
/>
          </Card>

          {/* ✅ Timeline */}
          <Card className="calendar-card" title="Project Timeline">
            <Chart
              chartType="Gantt"
              width="100%"
              height="400px"
              data={data}
              options={options}
              loader={<div>Loading Project Timeline...</div>}
            />
          </Card>

          {/* ✅ Updates */}
          <Card className="update-card">
  <h2>อัปเดตล่าสุดของแต่ละโครงการ</h2>
  <List
    loading={loading}
    dataSource={projectData}
    renderItem={(item) => (
      <List.Item>
        <List.Item.Meta
          avatar={
            <Avatar
              src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${item.username || "user"}`}
            />
          }
          title={item.project_name|| "ไม่ระบุ"}
          description={`สถานะ: ${item.status || "ไม่ทราบ"} • วันที่: ${item.createdAt
            ? new Date(item.createdAt).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "-"
          }`}
        />
      </List.Item>
    )}
  />
</Card>

        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default ProjectProgress;
