import { Layout } from "antd";

import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import "../../styles/UserManagement.css";

const { Sider, Content } = Layout;

const UserManagement = () => {
  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      {/* Sidebar */}
      <Sider width={220} className="lg:block hidden">
        <Sidebar />
      </Sider>

      <Layout>
        <Header title="User Management" />

        <Content className="userManagement-container"></Content>
      </Layout>
    </Layout>
  );
};

export default UserManagement;
