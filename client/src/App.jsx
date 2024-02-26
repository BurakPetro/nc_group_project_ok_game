import { useState } from "react";
import Instructions from "./components/Instructions";
import WelcomePage from "./components/WelcomePage";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/instructions" element={<Instructions />}></Route>
      </Routes>
    </>
  );
}

export default App;
