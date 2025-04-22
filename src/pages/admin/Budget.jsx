import { message, Layout, Button, Input, Card, Modal, Form, Table } from "antd";
import { RightOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
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
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const role = localStorage.getItem("role");
  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(null); // amont
  const [expense, setExpense] = useState(null); // amont
  const [balance, setBalance] = useState(null); // amont
  const [budget, setBudget] = useState({
    projectName: "",
    total: 0,
    spent: 0,
    remaining: 0,
  });
  const [form] = Form.useForm();

  const [lineData, setLineData] = useState({
    labels: [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม",
      "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม"
    ],
    datasets: [
      {
        label: "งบประมาณคงเหลือ",
        data: balance, // ✅ ต้องเป็น array ยาว 10 ค่า
        borderColor: "#52C41A",
        backgroundColor: "rgba(47, 139, 225, 0.2)",
        tension: 0.4,
        fill: false,
        borderWidth: 3,
        pointRadius: 0,
      },
      {
        label: "งบประมาณที่ใช้ไป",
        data: expense, // ✅ ต้องเป็น array ยาว 10 ค่า
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
      // 👉 ดึง role และ user_id จาก localStorage
      const role = localStorage.getItem("role");
      const user_id = localStorage.getItem("user_id");


      // ✅ ดึงข้อมูลโครงการทั้งหมดพร้อม role, user_id (ถ้า getAllProjects รองรับ query)
      // const data = await allBudgets(role, user_id);
      // setAmount(data.amount);

      // ✅ ดึงข้อมูลโครงการทั้งหมดพร้อม role, user_id (ถ้า getAllProjects รองรับ query)
      const allProjects = await getAllProjects(role, user_id);
      console.log("📊 ข้อมูลโครงการทั้งหมด:", allProjects);

      const budgetPromises = allProjects.map(async (project) => {
        const summary = await getBudgetSummary(project.project_id);

        const totalSpent = Array.isArray(summary.expenses)
          ? summary.expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0)
          : 0;


          const number = await allBudgetss(role, user_id);

          setBalance(number.balance);
          setExpense(number.expense); // amont
          setTotal(number.total); // amont

        return {
          projectId: project.project_id,
          projectName: project.project_name,
          totalBudget: Number(project.budget || 0),
          spentAmount: totalSpent,
          remainingBudget: Math.max(Number(project.budget || 0) - totalSpent, 0),
          description: summary.description || "",
          spentAt: summary.spent_at,
          spentBy: summary.spent_by,
        };
      });

      const allBudgets = await Promise.all(budgetPromises);

      const totalSpent = allBudgets.reduce((sum, b) => sum + b.amount, 0);
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

      console.log(allBudgets);
    } catch (error) {
      console.error("❌ เกิดข้อผิดพลาดในการโหลดข้อมูล:", error);
    }
  };

  useEffect(() => {
    fetchAllBudgets();
  }, []);


  const showExpenseModal = () => setIsExpenseModalVisible(true);
  form.setFieldsValue({
    budget_total: budget.total || 0, // 👈 เอาค่าจากการ์ดมาใส่ตรงนี้

  });
  const handleExpenseCancel = () => setIsExpenseModalVisible(false);

  const handleExpenseSubmit = async (values) => {
    try {
      const totalBudget = Number(values.budget_total) || 0;
      const spentAmount = Number(values.amount) || 0;
      console.log("📢 ค่าที่ได้รับจากฟอร์ม:", values.spentAmount);
      console.log("📢 ค่าที่ได้รับจากฟอร์ม:", values.budget_spent);

      const remainingBudget = Math.max(totalBudget - spentAmount, 0); // ป้องกันไม่ให้ค่าติดลบ

      const expenseData = {
        project_name: values.project_name,
        budget_total: totalBudget,
        budget_spent: values.budget_spent,
        budget_remaining: remainingBudget,
        spent_by: decoded.id, // ใช้ user_id แทน
      };

      const response = await recordExpense(expenseData); // ส่งข้อมูลไปบันทึก

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




  const barData = {
    labels: ["โครงการ 1", "โครงการ 2", "โครงการ 3", "โครงการ 4"],
    datasets: [
      {
        label: "งบประมาณที่ใช้ไป",
        data: [expense],
        backgroundColor: "#FF4D4F",
      },
      {
        label: "งบประมาณคงเหลือ",
        data: [balance],
        backgroundColor: "#52C41A",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { font: { size: 14, weight: "bold" }, color: "#555" },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { font: { size: 12 }, color: "#555" },
        grid: { color: "#ccc" },
      },
      x: {
        ticks: { font: { size: 12 }, color: "#555" },
        grid: { display: false },
      },
    },
  };

  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      <Sider width={220} className="lg:block hidden">
        <Sidebar />
      </Sider>
      <Layout>
        <Header title="Budget" />
        <Content className="budget-container px-4 py-6 md:px-8">
          <div className="budget-card-container space-y-4">
            {/* หัวข้อ */}
            <div className="budget-header">
              <h2 className="budget-title">ภาพรวมงบประมาณโครงการ</h2>
            </div>

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


            <div className="budget-summary grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* งบประมาณที่ใช้ไป */}
              <Card
                className="budget-card budget-used"
                style={{ backgroundColor: "#FFD700" }}
              >
                <p>งบประมาณที่ใช้ไป</p>
                <h3>{expense || "0"} บาท</h3> {/* ✅ ใช้ total_spent ที่เก็บไว้ใน state */}
              </Card>


              {/* งบประมาณคงเหลือ */}
              <Card
                className="budget-card budget-remaining w-full"
                style={{
                  backgroundColor: budget.remaining < 0 ? "#FF6347" : "#FFA500", // ถ้างบประมาณคงเหลือลบให้ใช้สีที่แตกต่าง
                }}
              >
                <p>งบประมาณคงเหลือ</p>
                <h3>{balance || "0"} บาท</h3> {/* แสดงงบประมาณคงเหลือ */}
              </Card>
            </div>

            {/* งบประมาณทั้งหมด */}
            <div className="budget-total-wrapper mt-4">
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

        <Content className="budget-chart-wrapper px-4 py-6">
          <Card className="budget-chart-card w-full">
            <p>เปรียบเทียบบงบประมาณที่ใช้ไปและคงเหลือของแต่ละโครงการ</p>
            <Bar options={chartOptions} data={barData} />
          </Card>
          <Card className="budget-linechart-card w-full mt-4">
  <p>กราฟเส้นเปรียบเทียบงบประมาณ</p>
  <div style={{ width: "100%", height: "280px" }}>
    <Line options={chartOptions} data={lineData} />
  </div>
</Card>

        </Content>

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
              pagination={false}
            />
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
