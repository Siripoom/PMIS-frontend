import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}api/budget`;


// ✅ ดึงข้อมูลสรุปงบประมาณของโครงการ
export const getBudgetSummary = async (projectId) => {
  try {
    const response = await axios.get(`${API_URL}/${projectId}`, {
      headers: {
        "ngrok-skip-browser-warning": "skip-browser-warning", // ✅ ข้าม Warning ของ Ngrok
        "Content-Type": "application/json", // ✅ ระบุว่าเราต้องการรับ JSON
      },
    });

    console.log("📌 Debug Response จาก API:", response.data); // ✅ Debug ข้อมูลที่ได้

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