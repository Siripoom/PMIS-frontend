import { message } from "antd"; // ✅ เพิ่มการนำเข้า message
import { Table } from "antd"; // เพิ่มการ import Table

import { Layout, Button, Input, Card } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { List } from "antd";
import { useState, useEffect } from "react";
import { Modal, Form } from "antd"; // ✅ นำเข้า Modal และ Form
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { getBudgetSummary, recordExpense } from "../../api/Budget"; // นำเข้า API
import { getAllProjects } from "../../api/ProjectManage"; // ✅ นำเข้า API สำหรับโครงการ
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
import "../../styles/Budget.css";
import Footer from "../../components/Footer/Footer";

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
//Mock data ของโครงการต่างๆ
const columns = [
  {
    title: "ชื่อโครงการ",
    dataIndex: "project_name", // ชื่อโปรเจค
    key: "project_name",
  },
  {
    title: "วันที่เริ่มต้น",
    dataIndex: "start_date", // วันที่เริ่มต้น
    key: "start_date",
    render: (start_date) => new Date(start_date).toLocaleDateString("th-TH"),
  },
  {
    title: "วันที่สิ้นสุด",
    dataIndex: "end_date", // วันที่สิ้นสุด
    key: "end_date",
    render: (end_date) => new Date(end_date).toLocaleDateString("th-TH"),
  },
];

const Budget = () => {
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [projects, setProjects] = useState([]);
  const [budget, setBudget] = useState({
    projectName: "",
    total: 0,
    spent: 0,
    remaining: 0,
  });
  const [hiddenData] = useState({
    projectId: "0c0b73a9-507b-4ee8-a4f2-4f82455dd167",
    spentBy: "6007fd99-589c-4230-8be3-f46b1a10db8a", // แทนค่าด้วย UUID ของ Admin
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedBudget = JSON.parse(localStorage.getItem("budgetData"));
        if (storedBudget) {
          console.log("📌 Using cached budget data:", storedBudget);
          setBudget(storedBudget);
        } else {
          const projectId = "0c0b73a9-507b-4ee8-a4f2-4f82455dd167";
          const response = await getBudgetSummary(projectId);

          if (!response || typeof response !== "object") {
            console.error("❌ API response is incorrect:", response);
            return;
          }

          const totalBudget = Number(response.budget_total) || 0;
          const spentAmount = Number(response.budget_spent) || 0;
          let remainingBudget = Number(response.budget_remaining);

          if (isNaN(remainingBudget) || remainingBudget < 0) {
            remainingBudget = Math.max(totalBudget - spentAmount, 0); // กำหนดค่าเริ่มต้นให้ remainingBudget
          }

          const budgetData = {
            total: totalBudget,
            spent: spentAmount,
            remaining: remainingBudget, // ให้ remainingBudget ถูกตั้งค่าก่อนใช้
          };

          localStorage.setItem("budgetData", JSON.stringify(budgetData));
          setBudget(budgetData);

          // อัปเดตข้อมูลกราฟเส้น
          setLineData((prevData) => ({
            ...prevData,
            datasets: [
              {
                ...prevData.datasets[0],
                data: [...prevData.datasets[0].data, remainingBudget],
              },
              {
                ...prevData.datasets[1],
                data: [...prevData.datasets[1].data, spentAmount],
              },
            ],
          }));
        }

        // ดึงข้อมูลโครงการทั้งหมด
        const allProjects = await getAllProjects();
        setProjects(allProjects); // ตั้งค่า state สำหรับโครงการ
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // ✅ เปิด-ปิด Modal บันทึกค่าใช้จ่าย
  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };
  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleExpenseSubmit = async (values) => {
    try {
      if (!hiddenData.projectId) {
        message.error("❌ ไม่สามารถบันทึกได้: ไม่พบ project_id");
        return;
      }

      // Define the data to be sent to the API
      const expenseData = {
        project_name: values.project_name,
        project_id: hiddenData.projectId,
        budget_total: Number(values.budget_total),
        budget_spent: Number(values.amount),
        budget_remaining: Number(values.budget_remaining),
        spent_by: "6007fd99-589c-4230-8be3-f46b1a10db8a",
      };

      console.log("📌 Sending data to API:", expenseData);

      // Send the data to the API and receive the response
      const response = await recordExpense(expenseData, {
        headers: {
          "ngrok-skip-browser-warning": "skip-browser-warning",
          "Content-Type": "application/json",
        },
      });

      console.log("✅ API Response:", response.data);

      // Update state and localStorage with the new values
      const updatedBudget = {
        total:
          Number(response.data.budget_total) || Number(values.budget_total),
        spent: Number(response.data.budget_spent) || Number(values.amount),
        remaining:
          Number(response.data.budget_remaining) ||
          Number(values.budget_remaining),
      };

      // Update state
      setBudget(updatedBudget);

      // Save the updated budget to localStorage
      localStorage.setItem("budgetData", JSON.stringify(updatedBudget));

      message.success(response.message || "✅ บันทึกค่าใช้จ่ายสำเร็จ!");
      handleExpenseCancel();
    } catch (error) {
      console.error("❌ Error recording expense:", error);
      message.error(
        error.response?.data?.error || "❌ เกิดข้อผิดพลาดในการบันทึกค่าใช้จ่าย!"
      );
    }
  };

  const labels = [
    "โครงการ 1",
    "โครงการ 2",
    "โครงการ 3",
    "โครงการ 4",
    "โครงการ 5",
    "โครงการ 6",
    "โครงการ 7",
    "โครงการ 8",
    "โครงการ 9",
    "โครงการ 10",
  ];
  const data = {
    labels,
    datasets: [
      {
        label: "งบประมาณที่ใช้ไป",
        data: [budget.spent],
        backgroundColor: "#FF4D4F",
      },
      {
        label: "งบประมาณคงเหลือ",
        data: [budget.remaining],
        backgroundColor: "#52C41A",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            weight: "bold",
          },
          color: "#555",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 12,
          },
          color: "#555",
        },
        grid: {
          color: "#ccc",
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
          color: "#555",
        },
        grid: {
          display: false,
        },
      },
    },
  };

  //กราฟเส้น
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
        label: "งบประมาณคงเหลือ", // งบประมาณคงเหลือ
        data: [], // เพิ่มข้อมูลที่ต้องการที่นี่
        borderColor: "#52C41A", // สีเส้น
        backgroundColor: "rgba(47, 139, 225, 0.2)", // สีพื้นหลัง
        tension: 0.4, // ทำให้เส้นไม่ตรงเกินไป
        fill: false, // ไม่กรอกพื้นที่ใต้เส้น
        borderWidth: 3, // ความหนาของเส้น
        pointRadius: 0, // ลบจุดที่ปรากฏ
      },
      {
        label: "งบประมาณที่ใช้ไป", // งบประมาณที่ใช้ไป
        data: [], // เพิ่มข้อมูลที่ต้องการที่นี่
        borderColor: "#722ED1", // สีเส้น
        backgroundColor: "rgba(114, 46, 209, 0.2)", // สีพื้นหลัง
        tension: 0.4, // ทำให้เส้นไม่ตรงเกินไป
        fill: false, // ไม่กรอกพื้นที่ใต้เส้น
        borderWidth: 3, // ความหนาของเส้น
        pointRadius: 0, // ลบจุดที่ปรากฏ
      },
    ],
  });

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 11,
          },
        },
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
        <Content className="budget-container">
          <div className="budget-card-container">
            <div className="budget-header">
              <h2 className="budget-title">ภาพรวมงบประมาณโครงการ</h2>
            </div>
            <div className="budget-actions">
              <Button
                type="default"
                icon={<PlusOutlined />}
                className="budget-expense-button"
                onClick={showExpenseModal} // ✅ Event Handler
              >
                บันทึกค่าใช้จ่าย
              </Button>

              <Button type="primary" className="budget-save-button">
                บันทึก
              </Button>
            </div>
            <div className="budget-summary">
              <Card
                className="budget-card budget-used"
                style={{ backgroundColor: "#FFD700" }}
              >
                <p>งบประมาณที่ใช้ไป</p>
                <h3>{budget.spent.toLocaleString()} บาท</h3>
              </Card>

              <Card
                className="budget-card budget-remaining"
                style={{
                  backgroundColor: budget.remaining < 0 ? "#FF6347" : "#FFA500",
                }}
              >
                <p>งบประมาณคงเหลือ</p>
                <h3>{Math.max(budget.remaining, 0).toLocaleString()} บาท</h3>
              </Card>
            </div>

            <div className="budget-total-wrapper">
              <Card
                className="budget-card budget-total"
                style={{ backgroundColor: "#808080" }}
              >
                <p>งบประมาณทั้งหมด</p>
                <h3>{budget.total.toLocaleString()} บาท</h3>
              </Card>
            </div>
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
          <Card className="budget-chart-card">
            <p className="budget-chart-title">
              เปรียบเทียบบงบประมาณที่ใช้ไปและคงเหลือของแต่ละโครงการ
            </p>
            <Bar options={options} data={data} />
          </Card>
          <Card className="budget-linechart-card">
            <p className="budget-linechart-title">
              กราฟเส้นเปรียบเทียบงบประมาณ
            </p>
            <div style={{ width: "100%", height: "280px" }}>
              <Line options={lineOptions} data={data} />
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
              dataSource={projects} // ใช้ข้อมูลจาก `projects` ที่ดึงมาจาก API
              rowKey="project_id" // ใช้ `project_id` เป็น key สำหรับแต่ละแถว
              pagination={false} // หากไม่ต้องการให้แสดง pagination
            />
          </Card>
        </Content>
        <Modal
          title="บันทึกค่าใช้จ่าย"
          open={isExpenseModalVisible}
          onCancel={handleExpenseCancel}
          footer={null} // ❌ ไม่มี Footer เพื่อให้ควบคุมปุ่มได้ใน Form
        >
          <Form
            layout="vertical"
            onFinish={handleExpenseSubmit}
            initialValues={{
              project_name: "",
              budget_total: 0,
              amount: 0,
              budget_remaining: 0,
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
              name="amount"
              rules={[
                { required: true, message: "กรุณากรอกจำนวนเงินที่ใช้ไป" },
              ]}
            >
              <Input type="number" placeholder="0.00" suffix="บาท" />
            </Form.Item>

            {/* ✅ งบประมาณคงเหลือของโครงการ */}
            <Form.Item
              label="งบประมาณคงเหลือของโครงการ"
              name="budget_remaining"
              rules={[{ required: true, message: "กรุณากรอกงบประมาณคงเหลือ" }]}
            >
              <Input type="number" placeholder="0.00" suffix="บาท" />
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
