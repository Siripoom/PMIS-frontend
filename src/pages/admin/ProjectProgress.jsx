import { Layout, Card, List, Avatar, Row, Col, Badge, Tag } from "antd";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import "../../styles/ProjectProgress.css";
import Footer from "../../components/Footer/Footer";
import { Chart } from "react-google-charts";

const { Sider, Content } = Layout;

// Function to convert days to milliseconds for Gantt chart
function daysToMilliseconds(days) {
  return days * 24 * 60 * 60 * 1000;
}

// Sample updates data
const updates = [
  {
    user: "John Doe",
    text: "Completed Requirements Analysis for Project Alpha",
    date: "2025-04-05",
  },
  {
    user: "Jane Smith",
    text: "Backend Development is in-progress for Project Beta",
    date: "2025-04-04",
  },
  {
    user: "Mike Johnson",
    text: "User Testing is delayed for Project Gamma",
    date: "2025-04-03",
  },
  {
    user: "Sara Williams",
    text: "UI Design is in todo list for Project Delta",
    date: "2025-04-02",
  },
];

// Project status data with task names matching status categories
const projectStatus = [
  { name: "Requirements Analysis", status: "Complete", dueDate: "Apr 5, 2025" },
  {
    name: "Backend Development",
    status: "In-progress",
    dueDate: "Apr 8, 2025",
  },
  {
    name: "Frontend Development",
    status: "In-progress",
    dueDate: "Apr 12, 2025",
  },
  { name: "UI Design", status: "Todo", dueDate: "Apr 15, 2025" },
  { name: "Documentation", status: "Todo", dueDate: "Apr 18, 2025" },
  { name: "User Testing", status: "Delay", dueDate: "Apr 10, 2025" },
];

const ProjectProgress = () => {
  // Gantt chart data definition with matching task names
  const columns = [
    { type: "string", label: "Task ID" },
    { type: "string", label: "Task Name" },
    { type: "date", label: "Start Date" },
    { type: "date", label: "End Date" },
    { type: "number", label: "Duration" },
    { type: "number", label: "Percent Complete" },
    { type: "string", label: "Dependencies" },
  ];

  // Each row represents a task with names matching the status categories
  const rows = [
    [
      "Requirements",
      "Requirements Analysis",
      new Date(2025, 3, 1),
      new Date(2025, 3, 5),
      null,
      100,
      null,
    ],
    [
      "BackendDev",
      "Backend Development",
      new Date(2025, 3, 6),
      new Date(2025, 3, 8),
      null,
      70,
      "Requirements",
    ],
    [
      "FrontendDev",
      "Frontend Development",
      new Date(2025, 3, 6),
      new Date(2025, 3, 12),
      null,
      25,
      "Requirements",
    ],
    [
      "UIDesign",
      "UI Design",
      new Date(2025, 3, 13),
      new Date(2025, 3, 15),
      null,
      0,
      "FrontendDev",
    ],
    [
      "Documentation",
      "Documentation",
      new Date(2025, 3, 16),
      new Date(2025, 3, 18),
      null,
      0,
      "UIDesign",
    ],
    [
      "UserTesting",
      "User Testing",
      new Date(2025, 3, 8),
      new Date(2025, 3, 10),
      null,
      50,
      "BackendDev",
    ],
  ];

  const data = [columns, ...rows];

  // Chart options
  const options = {
    height: 400,
    gantt: {
      trackHeight: 30,
      criticalPathEnabled: true,
      criticalPathStyle: {
        stroke: "#e64a19",
        strokeWidth: 2,
      },
      palette: [
        {
          color: "#5e97f6",
          dark: "#2a56c6",
          light: "#c9d7f8",
        },
      ],
    },
  };

  // Function to render status tags with appropriate colors
  const getStatusTag = (status) => {
    switch (status) {
      case "Todo":
        return <Tag color="blue">Todo</Tag>;
      case "In-progress":
        return <Tag color="green">In-progress</Tag>;
      case "Delay":
        return <Tag color="red">Delay</Tag>;
      case "Complete":
        return <Tag color="purple">Complete</Tag>;
      default:
        return <Tag>Unknown</Tag>;
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
          {/* Status Line Card */}
          <Card
            className="status-card"
            title={
              <div className="status-header">
                <span className="status-title">Project Tasks Status</span>
                <div className="status-legend">
                  <Badge color="blue" text="Todo" />
                  <Badge color="green" text="In-progress" />
                  <Badge color="red" text="Delay" />
                  <Badge color="purple" text="Complete" />
                </div>
              </div>
            }
            style={{ marginBottom: 16 }}
          >
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
              dataSource={projectStatus}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    size="small"
                    className="task-card"
                    style={{
                      borderLeft:
                        item.status === "Complete"
                          ? "4px solid purple"
                          : item.status === "In-progress"
                          ? "4px solid green"
                          : item.status === "Delay"
                          ? "4px solid red"
                          : "4px solid blue",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>{item.name}</div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 8,
                      }}
                    >
                      {getStatusTag(item.status)}
                      <span style={{ fontSize: "0.85rem", color: "#888" }}>
                        Due: {item.dueDate}
                      </span>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </Card>

          {/* Gantt Chart */}
          <Card className="calendar-card" title="Project Timeline">
            <Chart
              chartType="Gantt"
              width="100%"
              height="400px"
              data={data}
              options={options}
            />
          </Card>

          {/* Latest Updates */}
          <Card className="update-card">
            <h2>อัปเดตล่าสุดของแต่ละโครงการ</h2>
            <List
              dataSource={updates}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${item.user}`}
                      />
                    }
                    title={item.user}
                    description={`${item.text} - ${item.date}`}
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
