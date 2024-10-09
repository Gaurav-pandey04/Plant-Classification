import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ImageUpload from './components/ImageUpload.jsx';
import ResultDisplay from './components/ResultDisplay.jsx';
import ErrorPage from './components/ErrorPage.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>IMC - Image Classification</h1>
        <Routes>
          <Route path="/" element={<ImageUpload />} />
          <Route path="/result" element={<ResultDisplay />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
