import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:3000/api/analyze-plant', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const { isPlant, plantName, plantInfo, imageData } = response.data;

      if (isPlant) {
        navigate('/result', { state: { plantName, plantInfo, imageData } });
      } else {
        navigate('/error', { state: { message: 'The uploaded image is not a plant.' } });
      }
    } catch (error) {
      console.error('Error processing image:', error);
      const errorMessage = error.response?.data?.details || error.message || 'An unknown error occurred';
      navigate('/error', { state: { message: errorMessage } });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload a Plant Image</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} disabled={isLoading} />
        <button type="submit" disabled={isLoading || !image}>
          {isLoading ? 'Identifying Plant...' : 'Identify Plant'}
        </button>
      </form>
    </div>
  );
}

export default ImageUpload;
