import React from 'react';
import { useLocation } from 'react-router-dom';

function ErrorPage() {
  const location = useLocation();
  const errorMessage = location.state?.message || 'An error occurred. Please try again.';

  return (
    <div className="error">
      <h2>Error</h2>
      <p>{errorMessage}</p>
    </div>
  );
}

export default ErrorPage;
