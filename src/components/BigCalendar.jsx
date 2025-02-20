import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const projects = [
  {
    id: 1,
    title: "Project A - To Do",
    start: new Date(2025, 0, 1), // 1 Jan 2025
    end: new Date(2025, 0, 15), // 15 Jan 2025
    status: "To Do",
    color: "#4285F4", // Blue
  },
  {
    id: 2,
    title: "Project A - Doing",
    start: new Date(2025, 0, 10),
    end: new Date(2025, 1, 10),
    status: "Doing",
    color: "#7CB342", // Green
  },
  {
    id: 3,
    title: "Project A - Review",
    start: new Date(2025, 1, 15),
    end: new Date(2025, 2, 10),
    status: "Review",
    color: "#FF9800", // Orange
  },
  {
    id: 4,
    title: "Project A - Testing",
    start: new Date(2025, 2, 15),
    end: new Date(2025, 3, 10),
    status: "Testing",
    color: "#E65100", // Dark Orange
  },
  {
    id: 5,
    title: "Project A - Done",
    start: new Date(2025, 3, 15),
    end: new Date(2025, 4, 5),
    status: "Done",
    color: "#2E7D32", // Dark Green
  },
  {
    id: 6,
    title: "Project B - To Do",
    start: new Date(2025, 0, 5),
    end: new Date(2025, 0, 20),
    status: "To Do",
    color: "#546E7A", // Grey
  },
  {
    id: 7,
    title: "Project B - Doing",
    start: new Date(2025, 1, 1),
    end: new Date(2025, 1, 28),
    status: "Doing",
    color: "#1565C0", // Dark Blue
  },
  {
    id: 8,
    title: "Project B - Review",
    start: new Date(2025, 2, 5),
    end: new Date(2025, 2, 25),
    status: "Review",
    color: "#8BC34A", // Light Green
  },
  {
    id: 9,
    title: "Project B - Testing",
    start: new Date(2025, 3, 1),
    end: new Date(2025, 3, 30),
    status: "Testing",
    color: "#FF5722", // Deep Orange
  },
  {
    id: 10,
    title: "Project B - Done",
    start: new Date(2025, 4, 10),
    end: new Date(2025, 4, 30),
    status: "Done",
    color: "#4CAF50", // Medium Green
  },
];
// กำหนดสีสำหรับแต่ละสถานะ
const getEventColor = (status) => {
  switch (status) {
    case "To Do":
      return "#1E88E5"; // ฟ้า
    case "Doing":
      return "#43A047"; // เขียว
    case "Review":
      return "#FB8C00"; // ส้ม
    case "Testing":
      return "#D81B60"; // แดง
    case "Done":
      return "#6D4C41"; // น้ำตาล
    default:
      return "#546E7A"; // เทา
  }
};
const BigCalendar = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={projects}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={(event) => setSelectedEvent(event)}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: getEventColor(event.status),
            color: "#fff",
            borderRadius: "5px",
            padding: "5px",
          },
        })}
      />
      {selectedEvent && (
        <div
          style={{
            marginTop: 10,
            padding: 10,
            background: "#f5f5f5",
            borderRadius: 5,
          }}
        >
          <h4>รายละเอียดกิจกรรม</h4>
          <p>
            <strong>ชื่อ:</strong> {selectedEvent.title}
          </p>
          <p>
            <strong>วันที่เริ่ม:</strong>{" "}
            {moment(selectedEvent.start).format("DD/MM/YYYY")}
          </p>
          <p>
            <strong>วันที่สิ้นสุด:</strong>{" "}
            {moment(selectedEvent.end).format("DD/MM/YYYY")}
          </p>
        </div>
      )}
    </div>
  );
};

export default BigCalendar;
