import React from "react";
import "./style/app.scss";
import { Navigate, Route, Routes } from "react-router-dom";
import BoardPage from "./pages/BoardPage";
import CryptoPage from "./pages/CryptoPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/board" element={<BoardPage />} />
        <Route path="/crypto/*" element={<CryptoPage />} />
        <Route path="*" element={<Navigate replace to="/board" />} />
      </Routes>
    </div>
  );
}

export default App;
