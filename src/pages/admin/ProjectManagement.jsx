import { Layout } from "antd";

import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import "../../styles/ProjectManagement.css";

const { Sider, Content } = Layout;

const ProjectManagement = () => {
  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      {/* Sidebar */}
      <Sider width={220} className="lg:block hidden">
        <Sidebar />
      </Sider>

      <Layout>
        <Header title="Project Management" />

        <Content className="projectManagement-container"></Content>
      </Layout>
    </Layout>
  );
};

export default ProjectManagement;
