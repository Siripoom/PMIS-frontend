import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}api/budget`;


// ✅ ดึงข้อมูลสรุปงบประมาณของโครงการ
export const getBudgetSummary = async (projectId) => {
  try {
    const role = (localStorage.getItem("role") || "").toLowerCase(); // ป้องกัน Invalid role
    const user_id = localStorage.getItem("user_id");
    console.log("Project ID:", projectId);
    const response = await axios.get(`${API_URL}`, {
      headers: {
        "ngrok-skip-browser-warning": "skip-browser-warning",
        "Content-Type": "application/json",
      },
      params: {
        role,
        user_id,
        project_id: projectId,
      },
    });

    console.log("📌 Debug Response จาก API:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching budget summary:", error.response?.data || error);
    throw error;
  }
};



// ✅ บันทึกค่าใช้จ่ายใหม่
export const recordExpense = async (expenseData) => {
  try {
    const response = await axios.post(`${API_URL}`, expenseData, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error recording expense:", error.response?.data || error);
    throw error;
  }
};

export const allBudgetss = async (role, user_id) => {
  try {
    const response = await axios.get(`${API_URL}`, {
      headers: {
        "ngrok-skip-browser-warning": "skip-browser-warning",
        "Content-Type": "application/json",
      },
      params: {
        role: role,
        user_id: user_id,
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error fetching all budgets:", error.response?.data || error);
    throw error;
  }
};
