import Sidebar from "../../components/Sidebar";
import HeaderComponent from "../../components/Header";
import StationsTable from "../../components/StationsTable"; // นำเข้าตาราง
import { Layout } from "antd";
import "../../styles/stations.css";

const { Sider, Content } = Layout;

export const Stations = () => {
  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      <Sider width={220} className="lg:block hidden">
        <Sidebar />
      </Sider>

      <Layout>
        <Content className="Stations-container p-6">
          <HeaderComponent />
          <StationsTable />
        </Content>
      </Layout>
    </Layout>
  );
};
