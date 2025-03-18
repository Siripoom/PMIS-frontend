import axios from "axios";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/projectResource`;


export const createResource = async (data) => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: {
        "ngrok-skip-browser-warning": "skip-browser-warning",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error creating project resource:", error.message);
    console.error("🔍 API Response:", error.response?.data);
    throw error;
  }
};

export const getAllResources = async () => {
  try {
    console.log("📢 Calling API:", API_URL);
  
    const response = await axios.get(API_URL, {
      headers: {
        "ngrok-skip-browser-warning": "skip-browser-warning",
        "Content-Type": "application/json", // เพิ่ม Content-Type เพื่อให้แน่ใจว่า API ตอบกลับเป็น JSON
      },
      timeout: 5000, // Timeout 5 วินาที
    });
  
    console.log("✅ API Response (Raw Data):", response.data);
  
    if (!response.data) {
      console.error("❌ API ส่งข้อมูลเป็น `undefined` หรือ `null`:", response);
      return [];
    }
  
    // ✅ รองรับโครงสร้างที่แตกต่างกัน
    if (Array.isArray(response.data)) {
      return response.data; // กรณีที่ API ส่งเป็น Array ตรง ๆ
    } else if (response.data.projects && Array.isArray(response.data.projects)) {
      return response.data.projects; // กรณีที่ API ส่งข้อมูลใน `projects`
    } else if (response.data.data && response.data.data.projects && Array.isArray(response.data.data.projects)) {
      return response.data.data.projects; // กรณีที่ API ส่งข้อมูลใน `data.projects`
    } else {
      console.error("❌ API ส่งข้อมูลผิดโครงสร้าง:", response.data);
      return [];
    }
  } catch (error) {
    console.error("❌ Error fetching resources:", error.response?.data || error.message);
    return [];
  }
};


export const getResourceById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching project resource:", error.message);
    throw error;
  }
};

export const updateResource = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("❌ Error updating project resource:", error.message);
    throw error;
  }
};

export const deleteResource = async (resource_id) => {
  try {
    console.log(`📢 กำลังส่งคำขอลบ projectResource ID: ${resource_id} ไปยัง API`);
    await axios.delete(`${API_URL}/${resource_id}`);

    console.log("✅ ลบ projectResource สำเร็จ");
    return { success: true };
  } catch (error) {
    console.error("❌ Error deleting project resource:", error.message);
    throw error;
  }
};

export const useResource = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/use`, data, {
      headers: {
        "ngrok-skip-browser-warning": "skip-browser-warning",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error using project resource:", error.message);
    throw error;
  }
};