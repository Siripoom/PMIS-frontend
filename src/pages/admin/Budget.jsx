import React from "react";
import { v4 as uuidv4 } from "uuid"; // ✅ ใช้ UUID ในการสุ่มค่า
import { message } from "antd"; // ✅ เพิ่มการนำเข้า message
import { Layout, Button, Input, Card } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { List } from "antd";
import  { useState,useEffect } from "react";
import { Modal, Form } from "antd"; // ✅ นำเข้า Modal และ Form
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { getBudgetSummary,recordExpense } from "../../api/Budget"; // นำเข้า API
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

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);



const { Sider, Content } = Layout;
//Mock data ของโครงการต่างๆ
const projectData = [

];

const Budget = () => {
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [budget, setBudget] = useState({
    total: 0,
    spent: 0,
    remaining: 0,
  });
  const [hiddenData, setHiddenData] = useState({
    projectId: "",
    spentBy: "6007fd99-589c-4230-8be3-f46b1a10db8a", // แทนค่าด้วย UUID ของ Admin
  });

  // ✅ ดึงข้อมูลงบประมาณจาก API
  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const projectId = "0c0b73a9-507b-4ee8-a4f2-4f82455dd167"; // ใช้ projectId จริง
        const response = await getBudgetSummary(projectId);
  
        console.log("📌 Debug Response จาก API:", response); // ✅ Debug
  
        if (!response || typeof response !== "object") {
          console.error("❌ API ไม่ส่ง JSON กลับมา, อาจเป็น HTML หรือ Error:", response);
          return;
        }
  
        setBudget({
          total: Number(response.budget_total) || 0,
          spent: Number(response.budget_spent) || 0,
          remaining: Number(response.budget_remaining) || 0,
        });
  
        setHiddenData({
          projectId: response.project_id || "", 
          spentBy: response.spent_by || "6007fd99-589c-4230-8be3-f46b1a10db8a",
        });
  
        console.log("📌 hiddenData หลังจากดึงข้อมูล:", hiddenData);
        
      } catch (error) {
        console.error("❌ Error fetching budget summary:", error);
      }
    };
  
    fetchBudget();
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

        // ✅ กำหนดค่า `spent_by` เป็น ID ที่ต้องการส่ง
        const expenseData = {
            project_id: hiddenData.projectId, 
            budget_total: Number(values.budget_total), 
            budget_spent: Number(values.amount),
            budget_remaining: Number(values.budget_remaining),
            spent_by: "6007fd99-589c-4230-8be3-f46b1a10db8a", // ✅ ใช้ ID ที่คุณต้องการส่ง
        };

        console.log("📌 กำลังส่งข้อมูลไป API:", expenseData); // ✅ Debug log

        // ✅ ส่งข้อมูลไปยัง API
        const response = await recordExpense(expenseData, {
            headers: {
                "ngrok-skip-browser-warning": "skip-browser-warning",
                "Content-Type": "application/json",
            },
        });

        message.success(response.message || "✅ บันทึกค่าใช้จ่ายสำเร็จ!");
        handleExpenseCancel();
    } catch (error) {
        console.error("❌ Error recording expense:", error);

        // ✅ แสดงข้อความ Error ถ้ามีปัญหากับ API
        message.error(error.response?.data?.error || "❌ เกิดข้อผิดพลาดในการบันทึกค่าใช้จ่าย!");
    }
};



  const labels = ["โครงการ 1", "โครงการ 2", "โครงการ 3", "โครงการ 4", "โครงการ 5", "โครงการ 6", "โครงการ 7", "โครงการ 8", "โครงการ 9", "โครงการ 10"];
  const data = {
    labels,
    datasets: [
      
      {
        label: "งบประมาณที่ใช้ไป",
        data: [],
        backgroundColor: "#FF4D4F",
      },
      {
        label: "งบประมาณคงเหลือ",
        data: [],
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
  const lineData = {
    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October"],
    datasets: [
      {
        label: "งบประมาณคงเหลือ",
        data: [],
        borderColor: "#52C41A",
        backgroundColor: "rgba(24, 144, 255, 0.2)",
        tension: 0.4,
      },
      {
        label: "งบประมาณที่ใช้ไป",
        data: [],
        borderColor: "#722ED1", // สีม่วง
        backgroundColor: "rgba(114, 46, 209, 0.2)",
        tension: 0.4,
      }
    ],
  };
  

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
  <Card className="budget-card budget-used">
    <p>งบประมาณที่ใช้ไป</p>
    <h3>{budget.spent} บาท</h3> {/* ✅ เป็นตัวเลข */}
                
              </Card>
              <Card className="budget-card budget-remaining">
                <p>งบประมาณคงเหลือ</p>
                <h3>{budget.remaining} บาท</h3> {/* ✅ เป็นตัวเลข */}
              </Card>
            </div>
            <div className="budget-total-wrapper">
              <Card className="budget-card budget-total">
                <p>งบประมาณทั้งหมด</p>
                <h3>{budget.total} บาท</h3> {/* ✅ เป็นตัวเลข */}
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
            <p className="budget-chart-title">เปรียบเทียบบงบประมาณที่ใช้ไปและคงเหลือของแต่ละโครงการ</p>
            <Bar options={options} data={data} />
          </Card>
          <Card className="budget-linechart-card">
            <p className="budget-linechart-title">กราฟเส้นเปรียบเทียบงบประมาณ</p>
            <div style={{ width: "100%", height: "280px" }}>
              <Line options={lineOptions} data={lineData} />
            </div>
          </Card>
        </Content>
        <Content className="budget-card-row">
          <Card className="budget-card additional-info">
            <p>รายการโครงการ</p>
            <Button type="primary" shape="round" icon={<RightOutlined />} size="small" className="view-all-button">
              View All
            </Button>
            <List
              itemLayout="horizontal"
              dataSource={projectData}
              renderItem={(project) => (
                <List.Item actions={[<RightOutlined key="view" />]}>
                  <List.Item.Meta
                    title={
                      <span>
                        {project.title} <span style={{ color: "#ccc" }}> _________________ </span>
                      </span>
                    }
                    description={<span style={{ color: "#666" }}>{project.time}</span>}
                  />
                </List.Item>
              )}
            />
           
          </Card>
        </Content>
        <Modal
  title="บันทึกค่าใช้จ่าย"
  open={isExpenseModalVisible}
  onCancel={handleExpenseCancel}
  footer={null} // ❌ ไม่มี Footer เพื่อให้ควบคุมปุ่มได้ใน Form
>
  <Form layout="vertical" onFinish={handleExpenseSubmit} initialValues={{
    project_name: "",
    budget_total: 0,
    amount: 0,
    budget_remaining: 0
  }}>
    {/* ✅ งบประมาณของโครงการ (กรอกเอง) */}
    <Form.Item 
      label="งบประมาณของโครงการ"
      name="budget_total"
      rules={[{ required: true, message: "กรุณากรอกงบประมาณทั้งหมด" }]}
    >
      <Input type="number" placeholder="0.00" suffix="บาท" />
    </Form.Item>

    {/* ✅ งบประมาณที่ใช้ไปของโครงการ (กรอกเอง) */}
    <Form.Item 
      label="งบประมาณที่ใช้ไปของโครงการ"
      name="amount"
      rules={[{ required: true, message: "กรุณากรอกจำนวนเงินที่ใช้ไป" }]}
    >
      <Input type="number" placeholder="0.00" suffix="บาท" />
    </Form.Item>

    <Form.Item 
  label="งบประมาณคงเหลือของโครงการ"
  name="budget_remaining"
  rules={[{ required: true, message: "กรุณากรอกงบประมาณคงเหลือ" }]}
>
  <Input 
    type="number"
    placeholder="0.00"
    suffix="บาท"
    onChange={(e) => {
      const value = Number(e.target.value);
    }}
  />
</Form.Item>

    {/* ✅ ปุ่มบันทึกค่าใช้จ่าย */}
    <Form.Item>
      <Button type="primary" htmlType="submit">บันทึก</Button>
      <Button onClick={handleExpenseCancel} style={{ marginLeft: "8px" }}>ยกเลิก</Button>
    </Form.Item>
  </Form>
</Modal>

        <Footer />
      </Layout>
    </Layout>
  );
};

export default Budget;