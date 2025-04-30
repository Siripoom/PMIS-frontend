import { Layout, Card, Progress, Row, Col, Table } from "antd";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import "../../styles/Dashboard.css";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import Footer from "../../components/Footer/Footer";
import { useEffect, useState } from "react";
import { getAllProjects } from "../../api/ProjectManage";
import { getAllUsers } from "../../api/userManager";
import { getBudgetSummary, allBudgetss } from "../../api/Budget";
import dayjs from "dayjs";
import "dayjs/locale/th";
dayjs.locale("th");

const { Sider, Content } = Layout;

const projectColumns = [
  {
    title: "ชื่อโครงการ",
    dataIndex: "name",
    key: "name",
    render: (text) => <span className="text-gray-700">{text}</span>,
  },
  {
    title: "วันที่เริ่มโครงการ",
    dataIndex: "startDate",
    key: "startDate",
    render: (text) => (
      <span className="text-gray-500">
        {dayjs(text).add(543, "year").format("D MMMM YYYY")}
      </span>
    ),
  },
];

const statusColumns = [
  {
    title: "สถานะ",
    dataIndex: "name",
    key: "name",
    render: (text, record) => (
      <span className="flex items-center">
        <span
          className="inline-block w-3 h-3 rounded-full mr-2"
          style={{ backgroundColor: record.color }}
        ></span>
        {text}
      </span>
    ),
  },
  {
    title: "เปอร์เซ็นต์",
    dataIndex: "value",
    key: "value",
    render: (text) => <span className="text-gray-700">{text}%</span>,
  },
  {
    title: "จำนวน",
    dataIndex: "count",
    key: "count",
    render: (count) => <span className="text-gray-700">{count} โครงการ</span>,
  },
];

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [budgetSummaries, setBudgetSummaries] = useState([]);
  const [budget, setBudget] = useState({ total: 0, spent: 0, remaining: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const projectData = await getAllProjects();
        const userData = await getAllUsers();

        const updatedProjects = projectData.map((proj) => {
          const user = (userData.data || []).find(
            (u) => u.user_id === proj.created_by
          );
          return {
            ...proj,
            username: user ? user.username : "ไม่ระบุ",
          };
        });

        setProjects(updatedProjects);
        setUsers(userData.data || []);

        const budgetPromises = updatedProjects.map(async (project) => {
          const summary = await getBudgetSummary(project.project_id);

          const totalSpent = Array.isArray(summary.expenses)
            ? summary.expenses.reduce(
                (sum, e) => sum + Number(e.amount || 0),
                0
              )
            : 0;

          return {
            projectId: project.project_id,
            projectName: project.project_name,
            totalBudget: Number(project.budget || 0),
            spent: totalSpent,
            remaining: Math.max(Number(project.budget || 0) - totalSpent, 0),
          };
        });

        const allBudgets = await Promise.all(budgetPromises);
        setBudgetSummaries(allBudgets);

        const role = localStorage.getItem("role");
        const user_id = localStorage.getItem("user_id");

        const budgetData = await allBudgetss(role, user_id);
        console.log("Budget Data:", budgetData.balance);

        setBudget({
          total: budgetData.total || 0,
          spent: budgetData.expense || 0,
          remaining: budgetData.balance || 0,
        });
      } catch (err) {
        console.error("❌ Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const getUsernameById = (userId) => {
    if (!Array.isArray(users)) return "ไม่ระบุ";
    const user = users.find((u) => u.user_id === userId);
    return user ? user.username : "ไม่ระบุ";
  };

  const getProgressPercent = (status) => {
    switch (status) {
      case "Planned":
        return 25;
      case "In Progress":
        return 50;
      case "Completed":
      case "Delayed":
        return 100;
      default:
        return 0;
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case "Delayed":
        return "#dc3545";
      case "Completed":
        return "#28a745";
      default:
        return "#007bff";
    }
  };

  const getProjectStatusSummary = (projects) => {
    const statusCount = {
      Planned: 0,
      "In Progress": 0,
      Completed: 0,
      Delayed: 0,
    };

    projects.forEach((project) => {
      if (statusCount[project.status] !== undefined) {
        statusCount[project.status]++;
      }
    });

    const total = projects.length;

    return Object.entries(statusCount).map(([status, count]) => {
      const statusNameMap = {
        Planned: "วางแผนไว้",
        "In Progress": "กำลังดำเนินการ",
        Completed: "เสร็จสิ้น",
        Delayed: "ล่าช้า",
      };

      const colorMap = {
        Planned: "#A0A0A0",
        "In Progress": "#007bff",
        Completed: "#28a745",
        Delayed: "#dc3545",
      };

      return {
        name: statusNameMap[status],
        value: total > 0 ? Math.round((count / total) * 100) : 0,
        color: colorMap[status],
        count,
      };
    });
  };

  // ฟังก์ชันสำหรับจัดรูปแบบตัวเลขเป็นสกุลเงินบาท
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // จัดเตรียมข้อมูลงบประมาณรวมสำหรับแสดงในกราฟ
  const getBudgetChartData = () => {
    return [
      {
        name: "งบประมาณรวม",
        spent: budget.spent || 0,
        remaining: budget.remaining || 0,
      },
    ];
  };

  const statusData = getProjectStatusSummary(projects);

  return (
    <Layout className="min-h-screen flex">
      <Sider width={220} className="hidden lg:block">
        <Sidebar />
      </Sider>

      <Layout>
        <Header title="Dashboard" />

        <Content className="dashboard-container p-6 text-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-6">
              ข้อมูลด้านบริหารจัดการโครงการ
            </h2>

            {loading ? (
              <p>⏳ กำลังโหลดข้อมูลโครงการ...</p>
            ) : (
              <Row gutter={[16, 16]} justify="center">
                {projects.map((project, index) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={index}>
                    <Card
                      title={`โครงการ ${project.project_name}`}
                      bordered={false}
                      className="rounded-xl shadow-sm bg-white"
                    >
                      <p className="text-gray-700">
                        <strong>สถานะ:</strong> {project.status}
                      </p>
                      <p className="text-gray-700">
                        <strong>ผู้รับผิดชอบ:</strong>{" "}
                        {getUsernameById(project.created_by)}
                      </p>
                      <Progress
                        percent={getProgressPercent(project.status)}
                        strokeColor={getProgressColor(project.status)}
                        status={
                          project.status === "Completed" ? "success" : undefined
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>

          <div className="mt-6">
            <Row gutter={[16, 16]} justify="center" align="top">
              <Col xs={24} lg={12}>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h2 className="text-xl font-semibold mb-6">สถานะโครงการ</h2>
                  <Row gutter={[16, 16]} justify="center" align="middle">
                    <Col xs={24} md={12}>
                      <PieChart width={300} height={300}>
                        <Pie
                          data={statusData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </Col>
                    <Col xs={24} md={12}>
                      <Table
                        columns={statusColumns}
                        dataSource={statusData}
                        pagination={false}
                        bordered
                        showHeader={false}
                      />
                    </Col>
                  </Row>
                </div>
              </Col>

              <Col xs={24} lg={12}>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h2 className="text-xl font-semibold mb-6">งบประมาณ</h2>
                  {loading ? (
                    <p>⏳ กำลังโหลดข้อมูลงบประมาณ...</p>
                  ) : (
                    <>
                      <BarChart
                        width={600}
                        height={300}
                        data={getBudgetChartData()}
                        barCategoryGap={40}
                        barGap={5}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                        <Bar
                          dataKey="spent"
                          fill="#00bfff"
                          name="ใช้ไป"
                          barSize={30}
                        />
                        <Bar
                          dataKey="remaining"
                          fill="#ffa500"
                          name="คงเหลือ"
                          barSize={30}
                        />
                      </BarChart>
                    </>
                  )}
                </div>
              </Col>
            </Row>
          </div>

          <div className="mt-6">
            <Row gutter={[16, 16]} justify="center" align="top">
              <Col xs={24}>
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h2 className="text-xl font-semibold mb-6">ข้อมูลโครงการ</h2>
                  <Table
                    columns={projectColumns}
                    dataSource={projects.map((proj, index) => ({
                      key: index,
                      name: proj.project_name,
                      startDate: proj.start_date,
                    }))}
                    pagination={{ pageSize: 5 }}
                    bordered
                  />
                </div>
              </Col>
            </Row>
          </div>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default Dashboard;
