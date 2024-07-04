import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import PodcastDetails from './components/PodcastDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/podcast/:id" element={<PodcastDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
