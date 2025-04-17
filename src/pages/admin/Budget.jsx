import { message, Layout, Button, Input, Card, Modal, Form, Table } from "antd";
import { RightOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getBudgetSummary, recordExpense } from "../../api/Budget";
import { getAllProjects } from "../../api/ProjectManage";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "../../styles/Budget.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);
const token = localStorage.getItem("token");
const decoded = jwtDecode(token);

const { Sider, Content } = Layout;
const columns = [
  {
    title: "ชื่อโครงการ",
    dataIndex: "project_name",
    key: "project_name",
  },
  {
    title: "วันที่เริ่มต้น",
    dataIndex: "start_date",
    key: "start_date",
    render: (start_date) => new Date(start_date).toLocaleDateString("th-TH"),
  },
  {
    title: "วันที่สิ้นสุด",
    dataIndex: "end_date",
    key: "end_date",
    render: (end_date) => new Date(end_date).toLocaleDateString("th-TH"),
  },
];

const Budget = () => {
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [projects, setProjects] = useState([]);
  const [budget, setBudget] = useState({ projectName: "", total: 0, spent: 0, remaining: 0 });
  const [form] = Form.useForm();


  const [lineData, setLineData] = useState({
    labels: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม"],
    datasets: [
      {
        label: "งบประมาณคงเหลือ",
        data: [],
        borderColor: "#52C41A",
        backgroundColor: "rgba(47, 139, 225, 0.2)",
        tension: 0.4,
        fill: false,
        borderWidth: 3,
        pointRadius: 0,
      },
      {
        label: "งบประมาณที่ใช้ไป ",
        data: [],
        borderColor: "#722ED1",
        backgroundColor: "rgba(114, 46, 209, 0.2)",
        tension: 0.4,
        fill: false,
        borderWidth: 3,
        pointRadius: 0,
      },
    ],
  });

  const fetchAllBudgets = async () => {
    try {
      // ดึงข้อมูลโครงการทั้งหมด
      const allProjects = await getAllProjects();
  
      const budgetPromises = allProjects.map(async (project) => {
        // ดึงข้อมูลงบประมาณจาก API
        const summary = await getBudgetSummary(project.project_id);
  
        // ดึงข้อมูลจาก response และแปลงเป็นค่าใหม่
        return {
          projectId: project.project_id,
          projectName: project.project_name,
          amount: Number(summary.amount || 0),
          description: summary.description || "",
          spentAt: summary.spent_at, // เวลาที่ใช้จ่าย
          spentBy: summary.spent_by, // ผู้ใช้ที่ทำการใช้จ่าย
        };
      });
  
      // รอจนกระทั่งข้อมูลทั้งหมดถูกดึงมา
      const allBudgets = await Promise.all(budgetPromises);
  
      // อัพเดตข้อมูลโครงการและงบประมาณ
      setProjects(allProjects);
      setBudget(allBudgets); // เซตข้อมูลงบทั้งหมด
  
      console.log(allBudgets); // ดูข้อมูลทั้งหมดที่ดึงมาใน console
  
    } catch (error) {
      console.error("❌ เกิดข้อผิดพลาดในการโหลดข้อมูล:", error);
    }
  };
  
  useEffect(() => {
    fetchAllBudgets(); // เรียกฟังก์ชันนี้เมื่อคอมโพเนนต์โหลด
  }, []);
  

  const showExpenseModal = () => setIsExpenseModalVisible(true);
  const handleExpenseCancel = () => setIsExpenseModalVisible(false);

  const handleExpenseSubmit = async (values) => {
    try {
      const totalBudget = Number(values.budget_total) || 0;
      const spentAmount = Number(values.amount) || 0;
      const remainingBudget = Math.max(totalBudget - spentAmount, 0);  // ป้องกันไม่ให้ค่าติดลบ
  
      const expenseData = {
        project_name: values.project_name,
        budget_total: totalBudget,
        budget_spent: spentAmount,
        budget_remaining: remainingBudget,
        spent_by: decoded.id, // ใช้ user_id แทน
      };
  
      const response = await recordExpense(expenseData);  // ส่งข้อมูลไปบันทึก
  
      message.success(response.message || "✅ บันทึกค่าใช้จ่ายสำเร็จ!");
      handleExpenseCancel();
      await fetchAllBudgets(); // โหลดข้อมูลใหม่
    } catch (error) {
      console.error("❌ Error recording expense:", error);
      message.error(error.response?.data?.error || "❌ เกิดข้อผิดพลาดในการบันทึกค่าใช้จ่าย!");
    }
  };
  
  


  const barData = {
    labels: ["โครงการ 1", "โครงการ 2", "โครงการ 3", "โครงการ 4"],
    datasets: [
      { label: "งบประมาณที่ใช้ไป", data: [budget.spent], backgroundColor: "#FF4D4F" },
      { label: "งบประมาณคงเหลือ", data: [budget.remaining], backgroundColor: "#52C41A" },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { font: { size: 14, weight: "bold" }, color: "#555" } },
    },
    scales: {
      y: { beginAtZero: true, ticks: { font: { size: 12 }, color: "#555" }, grid: { color: "#ccc" } },
      x: { ticks: { font: { size: 12 }, color: "#555" }, grid: { display: false } },
    },
  };

  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      <Sider width={220} className="lg:block hidden"><Sidebar /></Sider>
      <Layout>
        <Header title="Budget" />
        <Content className="budget-container">
          <div className="budget-card-container">
            {/* หัวข้อ */}
            <div className="budget-header">
              <h2 className="budget-title">ภาพรวมงบประมาณโครงการ</h2>
            </div>

            {/* ปุ่มบันทึก */}
            <div className="budget-actions">
              <Button
                icon={<PlusOutlined />}
                className="budget-expense-button"
                onClick={showExpenseModal}
              >
                บันทึกค่าใช้จ่าย
              </Button>
              <Button type="primary" className="budget-save-button">
                บันทึก
              </Button>
            </div>

            {/* สรุปงบประมาณ */}
            <div className="budget-summary grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="budget-card budget-used" style={{ backgroundColor: "#FFD700" }}>
                <p>งบประมาณที่ใช้ไป</p>
                <h3>{budget?.spent?.toLocaleString?.() || "0"} บาท</h3>
              </Card>
              <Card className="budget-card budget-remaining" style={{ backgroundColor: budget.remaining < 0 ? "#FF6347" : "#FFA500" }}>
                <p>งบประมาณคงเหลือ</p>
                <h3>{budget.total !== undefined ? budget.total.toLocaleString() : "0"} บาท</h3>

              </Card>
            </div>

            <div className="budget-total-wrapper mt-4">
              <Card className="budget-card budget-total" style={{ backgroundColor: "#808080" }}>
                <p>งบประมาณทั้งหมด</p>
                <h3>{budget.total !== undefined ? budget.total.toLocaleString() : "0"} บาท</h3>

              </Card>
            </div>


            {/* ช่องค้นหา */}
            <div className="budget-search-container">
              <Input
                placeholder="Search"
                prefix={<SearchOutlined />}
                className="budget-search-input"
              />
            </div>
          </div>
        </Content>

        <Content className="budget-chart-wrapper">
          <Card className="budget-chart-card"><p>เปรียบเทียบบงบประมาณที่ใช้ไปและคงเหลือของแต่ละโครงการ</p><Bar options={chartOptions} data={barData} /></Card>
          <Card className="budget-linechart-card"><p>กราฟเส้นเปรียบเทียบงบประมาณ</p><div style={{ width: "100%", height: "280px" }}><Line options={chartOptions} data={lineData} /></div></Card>
        </Content>
        <Content className="budget-card-row">
          <Card className="budget-card additional-info">
            <p>รายการโครงการ</p>
            <Button type="primary" shape="round" icon={<RightOutlined />} size="small" className="view-all-button">View All</Button>
            <Table columns={columns} dataSource={projects} rowKey="project_id" pagination={false} />
          </Card>
        </Content>

        <Modal
  title="บันทึกค่าใช้จ่าย"
  open={isExpenseModalVisible}
  onCancel={handleExpenseCancel}
  footer={null} // ไม่มี Footer เพื่อให้ควบคุมปุ่มได้ใน Form
>
  <Form
    form={form}
    layout="vertical"
    onFinish={handleExpenseSubmit}
    onValuesChange={(changedValues, allValues) => {
      // คำนวณงบประมาณคงเหลือทุกครั้งเมื่อกรอกข้อมูลใหม่
      if (changedValues.budget_total || changedValues.budget_spent) {
        const total = Number(allValues.budget_total) || 0;
        const spent = Number(allValues.budget_spent) || 0;
        const remaining = Math.max(total - spent, 0); // ป้องกันค่าติดลบ
        form.setFieldsValue({ budget_remaining: remaining });
      }
    }}
  >
    {/* ✅ ชื่อโครงการ */}
    <Form.Item
      label="ชื่อโครงการ"
      name="project_name"
      rules={[{ required: true, message: "กรุณากรอกชื่อโครงการ" }]}
    >
      <Input placeholder="กรอกชื่อโครงการ" />
    </Form.Item>

    {/* ✅ งบประมาณทั้งหมดของโครงการ */}
    <Form.Item
      label="งบประมาณทั้งหมดของโครงการ"
      name="budget_total"
      rules={[{ required: true, message: "กรุณากรอกงบประมาณทั้งหมด" }]}
    >
      <Input type="number" placeholder="0.00" suffix="บาท" />
    </Form.Item>

    {/* ✅ งบประมาณที่ใช้ไปของโครงการ */}
    <Form.Item
      label="งบประมาณที่ใช้ไปของโครงการ"
      name="budget_spent"
      rules={[{ required: true, message: "กรุณากรอกจำนวนเงินที่ใช้ไป" }]}
    >
      <Input type="number" placeholder="0.00" suffix="บาท" />
    </Form.Item>

    {/* ✅ งบประมาณคงเหลือของโครงการ */}
    <Form.Item
      label="งบประมาณคงเหลือของโครงการ"
      name="budget_remaining"
      rules={[{ required: true, message: "กรุณากรอกงบประมาณคงเหลือ" }]}
    >
      <Input type="number" placeholder="0.00" suffix="บาท" disabled />
    </Form.Item>

    {/* ✅ ปุ่มบันทึกค่าใช้จ่าย */}
    <Form.Item>
      <Button type="primary" htmlType="submit">
        บันทึก
      </Button>
      <Button
        onClick={handleExpenseCancel}
        style={{ marginLeft: "8px" }}
      >
        ยกเลิก
      </Button>
    </Form.Item>
  </Form>
</Modal>

        <Footer />
      </Layout>
    </Layout>
  );
};

export default Budget;
