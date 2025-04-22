import axios from "axios";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}api/auth/login`;

export const login = async (data) => {
  try {
    console.log("📢 Sending login request...", data);

    // ✅ ส่ง Request ไปยัง API
    const response = await axios.post(API_URL, data);

    console.log("✅ Login response:", response.data);

    // ✅ ตรวจสอบว่ามี token และ role หรือไม่
    if (response.data && response.data.token && response.data.role) {
      localStorage.setItem("token", response.data.token);  // 🔹 บันทึก Token
      localStorage.setItem("role", response.data.role);    // 🔹 บันทึก Role
      localStorage.setItem("name", response.data.username);    // 🔹 บันทึก name
      localStorage.setItem("user_id", response.data.id);    // 🔹 บันทึก user_id
      console.log("✅ Token & Role stored in localStorage");
      return response.data;
    } else {
      throw new Error("❌ Login failed: No token or role received");
    }
  } catch (error) {
    console.error("❌ Error logging in:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    console.log("✅ User registered:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error registering user:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getMe = async () => {
  try {
    const token = localStorage.getItem("token"); // ✅ ดึง token จาก localStorage
    if (!token) throw new Error("❌ No token found, please login");

    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data; // ✅ API ควรส่งข้อมูลผู้ใช้กลับมา
  } catch (error) {
    console.error("❌ Error fetching user info:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const resetPassword = async (email, newPassword) => {
  try {
    const response = await axios.put(
      `${API_URL}/reset-password`,
      { email, password: newPassword }, // ✅ ส่ง email และ newPassword ใน body
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`❌ Error resetting password for email ${email}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};
