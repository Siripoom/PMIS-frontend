import axios from "axios";

const API_URL = "https://a3e9-1-47-155-199.ngrok-free.app/api/projects"; 

// ✅ ดึงข้อมูลโครงการทั้งหมด (ลบ getAuthHeader ออก)
export const getAllProjects = async () => {
  try {
    const response = await axios.get(API_URL); 
    return response.data.projects;
  } catch (error) {
    console.error("❌ Error fetching projects:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ สร้างโครงการใหม่
export const createProject = async (data) => {
  try {
    const response = await axios.post(API_URL, data); 
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
    const response = await axios.put(`${API_URL}/${id}`, data); 
    return response.data.project;
  } catch (error) {
    console.error("❌ Error updating project:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ ลบโครงการ
export const deleteProject = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`); 
    return response.data;
  } catch (error) {
    console.error("❌ Error deleting project:", error.response?.data || error.message);
    throw error;
  }
};
