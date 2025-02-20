import { Layout, Card, Progress, Row, Col, Table } from "antd";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import "../../styles/Dashboard.css";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
const { Sider, Content } = Layout;

const projects = [
  {
    name: "โครงการ A",
    status: "ดำเนินการ",
    progress: 70,
    owner: "สมชาย ใจดี",
  },
  {
    name: "โครงการ B",
    status: "เสร็จสิ้น",
    progress: 100,
    owner: "สมหญิง ขยัน",
  },
  {
    name: "โครงการ C",
    status: "รอดำเนินการ",
    progress: 20,
    owner: "สมปอง ตั้งใจ",
  },
  // สามารถเพิ่มโครงการเพิ่มเติมได้
];

const statusData = [
  { name: "กำลังดำเนินการ", value: 53, color: "#007bff" },
  { name: "วางแผนไว้", value: 21, color: "#A0A0A0" },
  { name: "เสร็จสิ้น", value: 17, color: "#28a745" },
  { name: "ล่าช้า", value: 9, color: "#dc3545" },
];

const budgetData = [
  { month: "Jan", thisMonth: 4000, lastMonth: 2400 },
  { month: "Feb", thisMonth: 3000, lastMonth: 1398 },
  { month: "Mar", thisMonth: 5000, lastMonth: 9800 },
  { month: "Apr", thisMonth: 2780, lastMonth: 3908 },
  { month: "May", thisMonth: 1890, lastMonth: 4800 },
  { month: "Jun", thisMonth: 2390, lastMonth: 3800 },
  { month: "Jul", thisMonth: 3490, lastMonth: 4300 },
];
const projectData = [
  { key: 1, name: "โครงการ A", startDate: "2023-01-15" },
  { key: 2, name: "โครงการ B", startDate: "2023-03-10" },
  { key: 3, name: "โครงการ C", startDate: "2023-05-22" },
  { key: 4, name: "โครงการ D", startDate: "2023-07-30" },
  { key: 5, name: "โครงการ E", startDate: "2023-09-12" },
];

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
    render: (text) => <span className="text-gray-500">{text}</span>,
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
    key: "count",
    render: (_, record) => (
      <span className="text-gray-700">
        {Math.round((record.value / 100) * 50)} โครงการ
      </span>
    ),
  },
];
const Dashboard = () => {
  return (
    <Layout className="min-h-screen flex">
      {/* Sidebar */}
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
            <Row gutter={[16, 16]} justify="center">
              {projects.map((project, index) => (
                <Col xs={24} sm={12} md={8} lg={6} key={index}>
                  <Card
                    title={project.name}
                    bordered={false}
                    className="rounded-xl shadow-sm bg-white"
                  >
                    <p className="text-gray-700">
                      <strong>สถานะ:</strong> {project.status}
                    </p>
                    <p className="text-gray-700">
                      <strong>ผู้รับผิดชอบ:</strong> {project.owner}
                    </p>
                    <Progress
                      percent={project.progress}
                      status={project.progress === 100 ? "success" : "active"}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
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
                  <BarChart width={600} height={300} data={budgetData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="thisMonth" fill="#00bfff" name="เดือนนี้" />
                    <Bar
                      dataKey="lastMonth"
                      fill="#ffa500"
                      name="เดือนที่แล้ว"
                    />
                  </BarChart>
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
                    dataSource={projectData}
                    pagination={{ pageSize: 5 }}
                    bordered
                  />
                </div>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
