import axios from "axios";

const API_URL = "https://8a16-202-44-35-79.ngrok-free.app/api";  // ใช้เฉพาะโดเมนหลัก และมีการเปลี่ยนแปลง

export const login = async (data) => {
  try {
    console.log("Login data:", data); // Debugging: ดูข้อมูลที่ส่งไป API

    // เรียก API สำหรับ Login
    const response = await axios.post(`${API_URL}/auth/login`,data);

    console.log("Login response:", response); // Debugging: ดูค่าที่ API ส่งกลับมา

    // เช็คว่า API ส่ง token กลับมาหรือไม่
    if (response.data && response.data.token) {
      localStorage.setItem("token", response.data.token);
      return response.data;
    } else {
      throw new Error("Login failed: No token received");
    }
  } catch (error) {
    console.error("Error logging in:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    console.log("User registered:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getMe = async () => {
  try {
    const token = localStorage.getItem("token"); // ดึง token จาก localStorage
    if (!token) throw new Error("No token found, please login");

    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data; // API ควรส่งข้อมูลผู้ใช้กลับมา
  } catch (error) {
    console.error("Error fetching user info:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const resetPassword = async (email, newPassword) => {
  try {
    const response = await axios.put(
      `${API_URL}/auth/reset-password`,
      { email, password: newPassword }, // ส่ง email และ newPassword ใน body
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error resetting password for email ${email}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};
