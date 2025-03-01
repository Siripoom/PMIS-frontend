import { Layout } from "antd";

import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import "../../styles/Budget.css";
import Footer from "../../components/Footer/Footer";
const { Sider, Content } = Layout;

const Budget = () => {
  return (
    <Layout style={{ minHeight: "100vh", display: "flex" }}>
      {/* Sidebar */}
      <Sider width={220} className="lg:block hidden">
        <Sidebar />
      </Sider>

      <Layout>
        <Header title="Budget" />

        <Content className="budget-container"></Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default Budget;
