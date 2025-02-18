import axios from "axios";

const API_URL = "https://d05c-1-46-88-107.ngrok-free.app/api/stations";

export const getStations = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    console.log("Stations:", response.data);
    return response; // ใช้ data.data ตามโครงสร้าง API
  } catch (error) {
    console.error("Error fetching stations:", error);
    throw error;
  }
};

export const getStationById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching station with id ${id}:`, error);
    throw error;
  }
};

export const createStation = async (stationData) => {
  try {
    console.log("Create station:", stationData);
    const response = await axios.post(API_URL, stationData);
    return response.user;
  } catch (error) {
    console.error("Error creating station:", error);
    throw error;
  }
};

export const updateStation = async (id, stationData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, stationData);
    return response.data;
  } catch (error) {
    console.error(`Error updating station with id ${id}:`, error);
    throw error;
  }
};

export const deleteStation = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting station with id ${id}:`, error);
    throw error;
  }
};
