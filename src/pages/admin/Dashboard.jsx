import Sidebar from "../../components/Sidebar";
import HeaderComponent from "../../components/Header";
import DashboardTable from "../../components/DashboardTable"; // นำเข้าตาราง
import { Layout } from "antd";

const { Sider, Content } = Layout;

export const Dashboard = () => {
  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      <Sider width={220} className="lg:block hidden">
        <Sidebar />
      </Sider>

      <Layout>
        <Content className="dashboard-container p-6">
          <HeaderComponent />
          <DashboardTable /> {/* แทรกตาราง */}
        </Content>
      </Layout>
    </Layout>
  );
};
