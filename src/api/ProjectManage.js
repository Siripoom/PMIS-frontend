  import axios from "axios";

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}api/projects`;

  // ✅ ดึงข้อมูลโครงการทั้งหมด
  export const getAllProjects = async () => {
    try {
      const role = (localStorage.getItem("role") || "").toLowerCase(); // ✅ ปรับตรงนี้
      const user_id = localStorage.getItem("user_id");
  
      console.log("📢 Calling API:", API_URL);
  
      const response = await axios.get(API_URL, {
        headers: {
          "ngrok-skip-browser-warning": "skip-browser-warning",
          "Content-Type": "application/json",
        },
        params: {
          role,
          user_id,
        },
      });
  
      console.log("✅ API Response (Raw Data):", response.data);
  
      if (!response.data) {
        console.error("❌ API ส่งข้อมูลเป็น `undefined` หรือ `null`:", response);
        return [];
      }
  
      if (Array.isArray(response.data.projects)) {
        return response.data.projects;
      } else if (response.data.data && Array.isArray(response.data.data.projects)) {
        return response.data.data.projects;
      } else if (Array.isArray(response.data)) {
        return response.data;
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
