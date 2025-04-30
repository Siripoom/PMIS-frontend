import { message, Layout, Button, Input, Card, Modal, Form, Table } from "antd";
import {
  RightOutlined,
  PlusOutlined,
  SearchOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getBudgetSummary, recordExpense, allBudgetss } from "../../api/Budget";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const { Sider, Content } = Layout;

// Responsive columns for the table
const columns = [
  {
    title: "ชื่อโครงการ",
    dataIndex: "project_name",
    key: "project_name",
    ellipsis: true,
  },
  {
    title: "วันที่เริ่มต้น",
    dataIndex: "start_date",
    key: "start_date",
    render: (start_date) => new Date(start_date).toLocaleDateString("th-TH"),
    responsive: ["md"],
  },
  {
    title: "วันที่สิ้นสุด",
    dataIndex: "end_date",
    key: "end_date",
    render: (end_date) => new Date(end_date).toLocaleDateString("th-TH"),
    responsive: ["md"],
  },
];

const Budget = () => {
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const role = localStorage.getItem("role");
  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(null); // amount
  const [expense, setExpense] = useState(null); // amount
  const [balance, setBalance] = useState(null); // amount
  const [budget, setBudget] = useState({
    projectName: "",
    total: 0,
    spent: 0,
    remaining: 0,
  });
  const [form] = Form.useForm();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Handle responsive window resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Line chart data
  const [lineData, setLineData] = useState({
    labels: [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
    ],
    datasets: [
      {
        label: "งบประมาณคงเหลือ",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Default empty array
        borderColor: "#52C41A",
        backgroundColor: "rgba(47, 139, 225, 0.2)",
        tension: 0.4,
        fill: false,
        borderWidth: 3,
        pointRadius: 0,
      },
      {
        label: "งบประมาณที่ใช้ไป",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Default empty array
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
      // ดึง role และ user_id จาก localStorage
      const role = localStorage.getItem("role");
      const user_id = localStorage.getItem("user_id");

      // ดึงข้อมูลโครงการทั้งหมด
      const allProjects = await getAllProjects(role, user_id);
      console.log("📊 ข้อมูลโครงการทั้งหมด:", allProjects);

      const budgetPromises = allProjects.map(async (project) => {
        const summary = await getBudgetSummary(project.project_id);

        const totalSpent = Array.isArray(summary.expenses)
          ? summary.expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0)
          : 0;

        // ดึงข้อมูลงบประมาณ
        const number = await allBudgetss(role, user_id);

        // อัปเดต state
        setBalance(number.balance);
        setExpense(number.expense);
        setTotal(number.total);

        // Update line chart data if there's balance/expense data
        if (number.balance && Array.isArray(number.balance)) {
          setLineData((prevData) => ({
            ...prevData,
            datasets: [
              {
                ...prevData.datasets[0],
                data: number.balance,
              },
              {
                ...prevData.datasets[1],
                data: number.expense,
              },
            ],
          }));
        }

        return {
          projectId: project.project_id,
          projectName: project.project_name,
          totalBudget: Number(project.budget || 0),
          spentAmount: totalSpent,
          remainingBudget: Math.max(
            Number(project.budget || 0) - totalSpent,
            0
          ),
          description: summary.description || "",
          spentAt: summary.spent_at,
          spentBy: summary.spent_by,
        };
      });

      const allBudgets = await Promise.all(budgetPromises);

      const totalSpent = allBudgets.reduce(
        (sum, b) => sum + (b.spentAmount || 0),
        0
      );
      const totalRemaining = allBudgets.reduce(
        (sum, budget) => sum + budget.remainingBudget,
        0
      );
      const totalBudget = allProjects.reduce(
        (sum, project) => sum + Number(project.budget || 0),
        0
      );

      setProjects(allProjects);
      setBudget({
        total: totalBudget,
        spent: totalSpent,
        remaining: totalRemaining,
      });

      console.log("Budget data:", allBudgets);
    } catch (error) {
      console.error("❌ เกิดข้อผิดพลาดในการโหลดข้อมูล:", error);
      message.error("ไม่สามารถโหลดข้อมูลงบประมาณได้");
    }
  };

  useEffect(() => {
    fetchAllBudgets();
  }, []);

  const showExpenseModal = () => setIsExpenseModalVisible(true);

  // Set form values
  useEffect(() => {
    form.setFieldsValue({
      budget_total: budget.total || 0,
    });
  }, [budget.total, form]);

  const handleExpenseCancel = () => setIsExpenseModalVisible(false);

  const handleExpenseSubmit = async (values) => {
    try {
      const totalBudget = Number(values.budget_total) || 0;
      const spentAmount = Number(values.budget_spent) || 0;

      const remainingBudget = Math.max(totalBudget - spentAmount, 0); // ป้องกันไม่ให้ค่าติดลบ

      const expenseData = {
        project_name: values.project_name,
        budget_total: totalBudget,
        budget_spent: spentAmount,
        budget_remaining: remainingBudget,
        spent_by: decoded.id,
      };

      const response = await recordExpense(expenseData);

      message.success(response.message || "✅ บันทึกค่าใช้จ่ายสำเร็จ!");
      handleExpenseCancel();
      await fetchAllBudgets(); // โหลดข้อมูลใหม่
    } catch (error) {
      console.error("❌ Error recording expense:", error);
      message.error(
        error.response?.data?.error || "❌ เกิดข้อผิดพลาดในการบันทึกค่าใช้จ่าย!"
      );
    }
  };

  // Bar chart data
  const barData = {
    labels: ["โครงการ 1", "โครงการ 2", "โครงการ 3", "โครงการ 4"],
    datasets: [
      {
        label: "งบประมาณที่ใช้ไป",
        data: Array.isArray(expense) ? expense : [expense],
        backgroundColor: "#FF4D4F",
      },
      {
        label: "งบประมาณคงเหลือ",
        data: Array.isArray(balance) ? balance : [balance],
        backgroundColor: "#52C41A",
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 14, weight: "bold" },
          color: "#555",
          boxWidth: screenWidth < 768 ? 10 : 40, // Smaller legend on mobile
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: { size: screenWidth < 768 ? 10 : 12 },
          color: "#555",
        },
        grid: { color: "#ccc" },
      },
      x: {
        ticks: {
          font: { size: screenWidth < 768 ? 10 : 12 },
          color: "#555",
        },
        grid: { display: false },
      },
    },
  };

  // Toggle mobile sidebar menu
  const toggleMobileMenu = () => {
    setIsMobileMenuVisible(!isMobileMenuVisible);
  };

  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      {/* Mobile menu button */}
      {screenWidth < 1024 && (
        <Button
          icon={<MenuOutlined />}
          onClick={toggleMobileMenu}
          style={{
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      )}

      {/* Desktop sidebar */}
      {screenWidth >= 1024 && (
        <Sider width={220} className="desktop-sidebar">
          <Sidebar />
        </Sider>
      )}

      {/* Mobile sidebar (conditional) */}
      {screenWidth < 1024 && isMobileMenuVisible && (
        <Sider
          width={220}
          className="mobile-sidebar"
          style={{
            position: "fixed",
            height: "100vh",
            zIndex: 999,
            left: 0,
            top: 0,
          }}
        >
          <Button
            icon={<MenuOutlined />}
            onClick={toggleMobileMenu}
            style={{
              margin: "10px",
              alignSelf: "flex-end",
            }}
          />
          <Sidebar />
        </Sider>
      )}

      <Layout>
        <Header title="Budget" />
        <Content className="budget-container">
          <div className="budget-card-container">
            {/* หัวข้อ */}
            <div className="budget-header">
              <h2 className="budget-title">ภาพรวมงบประมาณโครงการ</h2>

              {/* ปุ่มบันทึก */}
              <div className="budget-actions">
                {role === "admin" && (
                  <Button
                    icon={<PlusOutlined />}
                    className="budget-expense-button"
                    onClick={showExpenseModal}
                  >
                    บันทึกค่าใช้จ่าย
                  </Button>
                )}
              </div>
            </div>

            {/* งบประมาณที่ใช้ไป และ งบประมาณคงเหลือ (2 การ์ด) */}
            <div className="budget-summary">
              {/* งบประมาณที่ใช้ไป */}
              <Card
                className="budget-card budget-used"
                style={{ backgroundColor: "#FFD700" }}
              >
                <p>งบประมาณที่ใช้ไป</p>
                <h3>{expense || "0"} บาท</h3>
              </Card>

              {/* งบประมาณคงเหลือ */}
              <Card
                className="budget-card budget-remaining"
                style={{
                  backgroundColor: budget.remaining < 0 ? "#FF6347" : "#FFA500",
                }}
              >
                <p>งบประมาณคงเหลือ</p>
                <h3>{balance || "0"} บาท</h3>
              </Card>
            </div>

            {/* งบประมาณทั้งหมด */}
            <div className="budget-total-wrapper">
              <Card
                className="budget-card budget-total"
                style={{ backgroundColor: "#808080" }}
              >
                <p>งบประมาณทั้งหมด</p>
                <h3>{total || "0"} บาท</h3>
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

        {/* Charts Section */}
        <Content className="budget-chart-wrapper">
          <Card className="budget-chart-card">
            <p>เปรียบเทียบบงบประมาณที่ใช้ไปและคงเหลือของแต่ละโครงการ</p>
            <div style={{ width: "100%", height: "280px" }}>
              <Bar options={chartOptions} data={barData} />
            </div>
          </Card>

          <Card className="budget-linechart-card">
            <p>กราฟเส้นเปรียบเทียบงบประมาณ</p>
            <div style={{ width: "100%", height: "280px" }}>
              <Line options={chartOptions} data={lineData} />
            </div>
          </Card>
        </Content>

        {/* Projects Table */}
        <Content className="budget-card-row">
          <Card className="budget-card additional-info">
            <p>รายการโครงการ</p>
            <Button
              type="primary"
              shape="round"
              icon={<RightOutlined />}
              size="small"
              className="view-all-button"
            >
              View All
            </Button>
            <Table
              columns={columns}
              dataSource={projects}
              rowKey="project_id"
              pagination={{
                pageSize: screenWidth < 768 ? 5 : 10,
                responsive: true,
              }}
              scroll={{ x: screenWidth < 768 ? "max-content" : false }}
            />
          </Card>
        </Content>

        {/* Modal บันทึกค่าใช้จ่าย */}
        <Modal
          title="บันทึกค่าใช้จ่าย"
          open={isExpenseModalVisible}
          onCancel={handleExpenseCancel}
          footer={null}
          width={screenWidth < 768 ? "95%" : 520}
          centered
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
            {/* ชื่อโครงการ */}
            <Form.Item
              label="ชื่อโครงการ"
              name="project_name"
              rules={[{ required: true, message: "กรุณากรอกชื่อโครงการ" }]}
            >
              <Input placeholder="กรอกชื่อโครงการ" />
            </Form.Item>

            {/* งบประมาณทั้งหมดของโครงการ */}
            <Form.Item
              label="งบประมาณทั้งหมดของโครงการ"
              name="budget_total"
              rules={[{ required: true, message: "กรุณากรอกงบประมาณทั้งหมด" }]}
            >
              <Input type="number" placeholder="0.00" suffix="บาท" />
            </Form.Item>

            {/* งบประมาณที่ใช้ไปของโครงการ */}
            <Form.Item
              label="งบประมาณที่ใช้ไปของโครงการ"
              name="budget_spent"
              rules={[
                { required: true, message: "กรุณากรอกจำนวนเงินที่ใช้ไป" },
              ]}
            >
              <Input type="number" placeholder="0.00" suffix="บาท" />
            </Form.Item>

            {/* งบประมาณคงเหลือของโครงการ */}
            <Form.Item
              label="งบประมาณคงเหลือของโครงการ"
              name="budget_remaining"
              rules={[{ required: true, message: "กรุณากรอกงบประมาณคงเหลือ" }]}
            >
              <Input type="number" placeholder="0.00" suffix="บาท" disabled />
            </Form.Item>

            {/* ปุ่มบันทึกค่าใช้จ่าย */}
            <Form.Item className="flex flex-wrap justify-end gap-2">
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
