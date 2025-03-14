import axios from "axios";

const API_BASE_URL = "https://e9b4-1-46-152-188.ngrok-free.app/api/auth/users"; // ✅ ใช้ base URL ที่ถูกต้อง
// ✅ ดึงข้อมูล
export const getAllUser = async () => {
  try {
    console.log("📢 Calling API:", API_BASE_URL);
    const response = await axios.get(API_BASE_URL, {
      headers: { "ngrok-skip-browser-warning": "skip-browser-warning" }
    });

    console.log("✅ API Response:", response.data);
    return response.data || [];
  } catch (error) {
    console.error("❌ Error fetching users:", error.response?.data || error.message);
    return [];
  }
};

export const addUser = async (userData) => {
  try {
    console.log("📢 กำลังส่งข้อมูลผู้ใช้:", userData);

    const response = await axios.post(API_BASE_URL, userData, { // ✅ ใช้ `/register`
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "skip-browser-warning",
      },
    });

    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error registering user:", error.response?.data || error.message);
    throw error;
  }
};
// ✅ ฟังก์ชันลบผู้ใช้
export const deleteUser = async (userId) => {
  try {
    console.log(`🗑️ กำลังลบผู้ใช้ ID: ${userId}`);
    
    const response = await axios.delete(`${API_BASE_URL}/${userId}`, {
      headers: {
        "ngrok-skip-browser-warning": "skip-browser-warning",
      },
    });

    console.log("✅ ผู้ใช้ถูกลบสำเร็จ:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting user:", error.response?.data || error.message);
    throw error;
  }
};
export const editUser = async (userId, updatedData) => {
  try {
    console.log(`✏️ กำลังแก้ไขข้อมูลผู้ใช้ ID: ${userId}`);

    const response = await axios.put(`${API_BASE_URL}/${userId}`, updatedData, {
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "skip-browser-warning",
      },
    });

    console.log("✅ ข้อมูลผู้ใช้ถูกอัปเดตสำเร็จ:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error updating user:", error.response?.data || error.message);
    throw error;
  }
};
