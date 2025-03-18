import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Select } from "antd";
import * as FaIcons from "react-icons/fa"; // ไอคอน

const { Option } = Select;
const localizer = momentLocalizer(moment);

// ข้อมูลตัวอย่าง
const projects = [
  { id: 1, title: "To Do", start: new Date(2025, 0, 1), end: new Date(2025, 0, 5), status: "To Do" },
  { id: 2, title: "Doing", start: new Date(2025, 0, 10), end: new Date(2025, 1, 10), status: "Doing" },
  { id: 3, title: "Review", start: new Date(2025, 1, 15), end: new Date(2025, 2, 15), status: "Review" },
  { id: 4, title: "Testing", start: new Date(2025, 2, 15), end: new Date(2025, 3, 10), status: "Testing" },
  { id: 5, title: "Done", start: new Date(2025, 3, 15), end: new Date(2025, 3, 16), status: "Done" },
];

// ฟังก์ชันกำหนดสีของแต่ละสถานะตามวันสิ้นสุด
const getEventColor = (event) => {
  switch (event.status) {
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
      return "#000000"; // สีดำ
  }
};

// ฟังก์ชันเพิ่มไอคอนเข้าไปใน Event
const eventRenderer = ({ event }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      {event.status === "Testing" && <FaIcons.FaClock style={{ color: "white" }} />}
      {event.status === "Review" && <FaIcons.FaCommentAlt style={{ color: "white" }} />}
      {event.status === "Done" && <FaIcons.FaTrashAlt style={{ color: "white" }} />}
      <span>{event.title}</span>
    </div>
  );
};

const BigCalendar = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");

  return (
    <div style={{ padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
      {/* ส่วนหัวของหน้า */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ fontWeight: "bold" }}>ความคืบหน้าของโครงการ</h2>
        <Select
          value={selectedCategory}
          onChange={(value) => setSelectedCategory(value)}
          style={{ width: 200 }}
        >
          <Option value="ทั้งหมด">เลือกประเภท</Option>
          <Option value="Development">Development</Option>
          <Option value="Marketing">Marketing</Option>
          <Option value="Design">Design</Option>
        </Select>
      </div>

      {/* Gantt Chart */}
      <Calendar
        localizer={localizer}
        events={projects}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600, backgroundColor: "#fff", borderRadius: "10px", padding: "10px" }}
        onSelectEvent={(event) => setSelectedEvent(event)}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: getEventColor(event), // ใช้สีจาก getEventColor
            color: "#fff",
            borderRadius: "6px",
            padding: "4px 8px",
            height: "24px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
          },
        })}
        components={{ event: eventRenderer }}
        views={['month', 'week', 'day']} // การเลือกมุมมอง
        toolbar={true} // แสดงปุ่ม Today, Back, Next
        messages={{
          today: 'วันนี้',
          previous: 'ย้อนกลับ',
          next: 'ถัดไป',
          month: 'เดือน',
          week: 'สัปดาห์',
          day: 'วัน',
        }}
      />

      {/* รายละเอียดโครงการที่เลือก */}
      {selectedEvent && (
        <div style={{ marginTop: 20, padding: 10, background: "#f5f5f5", borderRadius: 5 }}>
          <h4>รายละเอียดกิจกรรม</h4>
          <p><strong>ชื่อ:</strong> {selectedEvent.title}</p>
          <p><strong>วันที่เริ่ม:</strong> {moment(selectedEvent.start).format("DD/MM/YYYY")}</p>
          <p><strong>วันที่สิ้นสุด:</strong> {moment(selectedEvent.end).format("DD/MM/YYYY")}</p>
        </div>
      )}
    </div>
  );
};

export default BigCalendar;
