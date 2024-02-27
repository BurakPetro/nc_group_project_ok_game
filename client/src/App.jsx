import { useState } from "react";
import Instructions from "./components/Instructions";
import WelcomePage from "./components/WelcomePage";
import { Routes, Route } from "react-router-dom";
import ProgectInfo from "./components/ProgectInfo";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/progect-info" element={<ProgectInfo />} />
        <Route path="/instructions" element={<Instructions />} />
      </Routes>
    </>
  );
}

export default App;
