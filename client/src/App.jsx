import { useState } from "react";
import Instructions from "./components/Instructions";
import WelcomePage from "./components/WelcomePage";
import { Routes, Route } from "react-router-dom";
import ProjectInfo from "./components/ProjectInfo";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/progect-info" element={<ProjectInfo />} />
        <Route path="/instructions" element={<Instructions />} />
      </Routes>
    </>
  );
}

export default App;
