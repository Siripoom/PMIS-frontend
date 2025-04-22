import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}api/notifications`;

// ✅ ดึงข้อมูลการแจ้งเตือนจาก API
export const getNotifications = async () => {
  try {
    // 👉 ดึง role และ user_id จาก localStorage
    const role = localStorage.getItem("role");
    const user_id = localStorage.getItem("user_id");

    const response = await axios.get(API_URL, {
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
      },
      // ✅ ส่ง role และ user_id เป็น query parameters
      params: {
        role,
        user_id,
      },
    });

    if (!response.data || !Array.isArray(response.data.notifications)) {
      throw new Error("❌ ข้อมูล API ไม่ถูกต้อง");
    }

    console.log("✅ แจ้งเตือนที่ได้รับจาก API:", response.data.notifications);
    return response.data.notifications;
  } catch (error) {
    console.error("❌ Error fetching notifications:", error.response?.data || error.message);
    throw error;
  }
};

