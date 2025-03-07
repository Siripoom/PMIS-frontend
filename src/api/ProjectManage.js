  import axios from "axios";

  const API_URL = "https://5961-1-46-135-34.ngrok-free.app/api/projects";

  // ✅ ดึงข้อมูลโครงการทั้งหมด
  export const getAllProjects = async () => {
    try {
      console.log("📢 Calling API:", API_URL);
  
      const response = await axios.get(API_URL, {
        headers: {
          "ngrok-skip-browser-warning": "skip-browser-warning",
        }
      });
  
      console.log("✅ API Response (Raw Data):", response.data);
  
      if (!response.data) {
        console.error("❌ API ส่งข้อมูลเป็น `undefined` หรือ `null`:", response);
        return [];
      }
  
      // ✅ รองรับโครงสร้างที่แตกต่างกัน
      if (Array.isArray(response.data.projects)) {
        return response.data.projects; // ✅ ใช้ได้เลย
      } else if (response.data.data && Array.isArray(response.data.data.projects)) {
        return response.data.data.projects; // ✅ กรณี `data.projects`
      } else if (Array.isArray(response.data)) {  
        return response.data; // ✅ กรณีที่ API ส่งเป็น `[]` ตรง ๆ
      } else {
        console.error("❌ API ส่งข้อมูลผิดโครงสร้าง:", response.data);
        return [];
      }
    } catch (error) {
      console.error("❌ Error fetching projects:", error.response?.data || error.message);
      return [];
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
