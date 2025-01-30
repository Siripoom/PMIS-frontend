import { Breadcrumb, Input, Layout } from "antd";
import { HomeOutlined, SearchOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import "./Header.css";

const { Header } = Layout;
const { Search } = Input;

const HeaderComponent = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);

  return (
    <Header className="header-container">
      {/* Breadcrumbs */}
      <Breadcrumb className="breadcrumb">
        {/* <Breadcrumb.Item>สถานีระบายน้ำ</Breadcrumb.Item> */}
        {pathSnippets.map((snippet, index) => {
          const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
          return (
            <Breadcrumb.Item key={url}>
              {snippet.charAt(0).toUpperCase() + snippet.slice(1)}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>

      {/* Search Bar */}
      <Search
        placeholder="ค้นหา..."
        allowClear
        prefix={<SearchOutlined />}
        className="search-bar"
      />
    </Header>
  );
};

export default HeaderComponent;
