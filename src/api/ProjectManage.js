import axios from "axios";

const API_URL = "https://593a-1-47-155-199.ngrok-free.app/api/projects";

// ✅ ดึงข้อมูลโครงการทั้งหมด
export const getAllProjects = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log("✅ Raw API Response:", response.data); // ตรวจสอบค่าที่ API ตอบกลับ

    if (!response.data || !Array.isArray(response.data.projects)) {
      console.error("❌ API ไม่ส่งข้อมูลโครงการในรูปแบบที่คาดหวัง:", response.data);
      return [];
    }

    return response.data.projects;
  } catch (error) {
    console.error("❌ Error fetching projects:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ สร้างโครงการใหม่
export const createProject = async (data) => {
  try {
    console.log("📢 Sending project data:", data);
    const response = await axios.post(API_URL, data);
    console.log("✅ Project Created:", response.data.project);
    return response.data.project;
  } catch (error) {
    console.error("❌ Error adding project:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ ดึงโครงการตาม ID
export const getProjectById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.project;
  } catch (error) {
    console.error("❌ Error fetching project:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ อัปเดตโครงการ
export const updateProject = async (id, data) => {
  try {
    console.log("📢 Updating project ID:", id, "with data:", data);
    const response = await axios.put(`${API_URL}/${id}`, data);
    console.log("✅ Project Updated:", response.data.project);
    return response.data.project;
  } catch (error) {
    console.error("❌ Error updating project:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ ลบโครงการ
export const deleteProject = async (id) => {
  try {
    console.log("📢 Deleting project ID:", id);
    const response = await axios.delete(`${API_URL}/${id}`);
    console.log("✅ Project Deleted");
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting project:", error.response?.data || error.message);
    throw error;
  }
};
