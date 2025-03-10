import axios from "axios";

const API_URL = "https://d612-202-14-164-203.ngrok-free.app/api/projectResource";

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
    const response = await axios.get(API_URL, {
      headers: {
        "ngrok-skip-browser-warning": "skip-browser-warning",
      },
    });

    console.log("✅ API Response จาก getAllProjectResources:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching project resources:", error.message);
    console.error("🔍 API Response:", error.response?.data);
    throw error;
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
