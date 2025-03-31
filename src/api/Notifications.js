import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}api/notifications/all`;

// ✅ ดึงข้อมูลการแจ้งเตือนจาก API
export const getNotifications = async () => {
  try {
    const response = await axios.get(API_URL, { // ใช้ API_URL ที่ถูกต้อง
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
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
