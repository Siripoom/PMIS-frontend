import { Layout } from "antd";

import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import "../../styles/Report.css";

const { Sider, Content } = Layout;

const Report = () => {
  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      {/* Sidebar */}
      <Sider width={220} className="lg:block hidden">
        <Sidebar />
      </Sider>

      <Layout>
        <Header title="Report" />

        <Content className="report-container"></Content>
      </Layout>
    </Layout>
  );
};

export default Report;
