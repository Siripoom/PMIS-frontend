import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import { Stations } from "./pages/admin/Stations";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Add routes here */}
          <Route path="/" element={<Login />} />
          <Route path="/admin/station/info" element={<Stations />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
