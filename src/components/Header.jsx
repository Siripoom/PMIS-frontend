import { Layout, Input } from "antd";
import "./Header.css";

const { Header } = Layout;
const { Search } = Input;

const HeaderComponent = () => {
  return (
    <Header className="header-container">
      {/* ชื่อระบบ */}
      <h1 className="header-title" >ระบบบริหารจัดการโครงการ</h1>

      {/* Search Bar (ไม่มีไอคอนทางซ้าย) */}
      <Search
        placeholder="Search"
        className="search-bar"
      />
    </Header>
  );
};

export default HeaderComponent;
