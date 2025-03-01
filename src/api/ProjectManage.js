import axios from "axios";

const API_URL = "https://bbe2-1-47-155-199.ngrok-free.app/api/projects"; // 🛑 แก้เป็น URL ของคุณ

// ✅ ดึงข้อมูลโครงการทั้งหมด
export const getAllProjects = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.projects;
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    throw error;
  }
};

// ✅ เพิ่มโครงการ
export const createProject = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data.project;
  } catch (error) {
    console.error("❌ Error adding project:", error);
    throw error;
  }
};

// ✅ แก้ไขโครงการ
export const updateProject = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data.project;
  } catch (error) {
    console.error("❌ Error updating project:", error);
    throw error;
  }
};

// ✅ ลบโครงการ
export const deleteProject = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting project:", error);
    throw error;
  }
};
