import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Welcome from './pages/Welcome';
import EncryptionMethod from './pages/EncryptionMethod';
import Encrypt from './pages/Encrypt';
import Decrypt from './pages/Decrypt';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/encryption-method" element={<EncryptionMethod />} />
          <Route path="/encrypt" element={<Encrypt />} />
          <Route path="/decrypt" element={<Decrypt />} />
          <Route path="/" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;