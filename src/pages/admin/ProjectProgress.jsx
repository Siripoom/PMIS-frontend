import { Layout, Card, List, Avatar } from "antd";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import BigCalendar from "../../components/BigCalendar"; // Import Calendar Component
import "../../styles/ProjectProgress.css";

const { Sider, Content } = Layout;

const updates = [
  {
    id: 1,
    user: "phalat01",
    text: "อัพเดตความคืบหน้าโครงการ",
    date: "2017-10-31 23:12:00",
  },
  {
    id: 2,
    user: "pick-up00",
    text: "อัพเดตความคืบหน้าโครงการ",
    date: "2017-10-31 23:12:00",
  },
  {
    id: 3,
    user: "pick-up55",
    text: "อัพเดตความคืบหน้าโครงการ",
    date: "2017-10-31 23:12:00",
  },
];

const ProjectProgress = () => {
  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      <Sider width={220} className="lg:block hidden">
        <Sidebar />
      </Sider>

      <Layout>
        <Header title="Project Management" />

        <Content className="projectProgress-container">
          {/* Big Calendar */}
          <Card className="calendar-card">
            <h2>ปฏิทินความคืบหน้าของโครงการ</h2>
            <BigCalendar />
          </Card>

          {/* อัปเดตล่าสุด */}
          <Card className="update-card">
            <h2>อัปเดตล่าสุดของแต่ละโครงการ</h2>
            <List
              dataSource={updates}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${item.user}`}
                      />
                    }
                    title={item.user}
                    description={`${item.text} - ${item.date}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProjectProgress;
