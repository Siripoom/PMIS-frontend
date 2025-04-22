import axios from "axios";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}api/projectResource`;

/// Function to create a  resource

export const createResourceProject = async (data) => {
  const { project_id, resource_id, use_quantity, allocated_by } = data;
  
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

export const getAllResourcesProject = async () => {
  try {
    // 👉 ดึงและปรับ role เป็น lowercase เพื่อให้ backend ยอมรับ
    const role = (localStorage.getItem("role") || "").toLowerCase();
    const user_id = localStorage.getItem("user_id");

    const response = await axios.get(API_URL, {
      headers: {
        "ngrok-skip-browser-warning": "skip-browser-warning",
        "Content-Type": "application/json",
      },
      params: {
        role,
        user_id,
      },
      timeout: 5000,
    });

    console.log("✅ API Response (Raw Data):", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "❌ Error fetching resources:",
      error.response?.data || error.message
    );
    return [];
  }
};



export const getResourceByIdProject = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching project resource:", error.message);
    throw error;
  }
};

export const updateResourceProject = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("❌ Error updating project resource:", error.message);
    throw error;
  }
};

export const deleteResourceProject = async (resource_id) => {
  try {
    console.log(
      `📢 กำลังส่งคำขอลบ projectResource ID: ${resource_id} ไปยัง API`
    );
    await axios.delete(`${API_URL}/${resource_id}`);

    console.log("✅ ลบ projectResource สำเร็จ");
    return { success: true };
  } catch (error) {
    console.error("❌ Error deleting project resource:", error.message);
    throw error;
  }
};

export const useResourceProject = async (data) => {
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
