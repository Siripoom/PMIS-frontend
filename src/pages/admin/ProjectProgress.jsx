import { Layout } from "antd";

import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import "../../styles/ProjectProgress.css";

const { Sider, Content } = Layout;

const ProjectProgress = () => {
  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      {/* Sidebar */}
      <Sider width={220} className="lg:block hidden">
        <Sidebar />
      </Sider>

      <Layout>
        <Header title="Project Progress" />

        <Content className="projectProgress-container"></Content>
      </Layout>
    </Layout>
  );
};

export default ProjectProgress;
