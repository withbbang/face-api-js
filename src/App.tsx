import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from 'screens/index';
import NotFound from 'screens/notFound';
import Webcam from 'screens/webcam';

const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/webcam" element={<Webcam />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
