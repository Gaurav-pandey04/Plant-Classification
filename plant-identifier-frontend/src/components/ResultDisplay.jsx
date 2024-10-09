import React from 'react';
import { useLocation } from 'react-router-dom';

function ResultDisplay() {
  const location = useLocation();
  const { plantName, plantInfo, imageData } = location.state;

  return (
    <div className="result">
      <h2>{plantName}</h2>
      {imageData && <img src={imageData} alt={plantName} />}
      <p>{plantInfo}</p>
    </div>
  );
}

export default ResultDisplay;
