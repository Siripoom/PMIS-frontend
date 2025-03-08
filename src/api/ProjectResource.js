import axios from "axios";

const API_URL = "https://fe62-1-47-158-78.ngrok-free.app/api/resource";


export const createResource = async (data) => {
    try {
      const response = await axios.post(API_URL, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error creating resource:", error.message);
      console.error("🔍 API Response:", error.response?.data); // ✅ Debug ตอบกลับจาก Backend
      throw error;
    }
  };
  

// ✅ GET: ดึงรายการทรัพยากรทั้งหมด
export const getAllResources = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching resources:", error.message);
    throw error;
  }
};

// ✅ GET: ดึงข้อมูลทรัพยากรตาม ID
export const getResourceById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching resource:", error.message);
    throw error;
  }
};

// ✅ PUT: อัปเดตทรัพยากร
export const updateResource = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("❌ Error updating resource:", error.message);
    throw error;
  }
};

// ✅ DELETE: ลบทรัพยากร
export const deleteResource = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Error deleting resource:", error.message);
    throw error;
  }
};

// ✅ POST: ใช้ทรัพยากร
export const useResource = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/${id}/use`);
    return response.data;
  } catch (error) {
    console.error("❌ Error using resource:", error.message);
    throw error;
  }
};
