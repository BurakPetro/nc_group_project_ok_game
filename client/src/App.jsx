import { useState } from 'react';

import WelcomePage from './components/WelcomePage';
import { Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/Welcome" element={<WelcomePage />} />
      </Routes>
    </>
  );
}

export default App;
