import axios from "axios";
// ดึงค่าจาก .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ฟังก์ชันดึงข้อมูลผู้ใช้ทั้งหมด
export const getAllUsers = async () => {
  try {
    console.log("📢 Calling API to fetch all users");
    
    const response = await axios.get(`${API_BASE_URL}/api/auth/users`, {
      headers: { "ngrok-skip-browser-warning": "skip-browser-warning" }
    });

    console.log("✅ API Response:", response.data);
    return response.data || [];
  } catch (error) {
    console.error("❌ Error fetching users:", error.response?.data || error.message);
    return [];
  }
};

// ฟังก์ชันเพิ่มผู้ใช้ใหม่
export const addUser = async (userData) => {
  try {
    console.log("📢 Sending user data:", userData);

    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, userData, {
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

// ฟังก์ชันลบผู้ใช้
export const deleteUser = async (userId) => {
  try {
    console.log(`🗑️ กำลังลบผู้ใช้ ID: ${userId}`);

    // แก้ไข URL โดยเพิ่มเครื่องหมาย '/' ระหว่าง API path และ userId
    const response = await axios.delete(`${API_BASE_URL}/api/auth/users/${userId}`, {
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


// ฟังก์ชันแก้ไขข้อมูลผู้ใช้
export const editUser = async (userId, updatedData) => {
  try {
    console.log(`✏️ กำลังแก้ไขข้อมูลผู้ใช้ ID: ${userId}`);

    const response = await axios.put(`${API_BASE_URL}/api/auth/users/${userId}`, updatedData, {
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
