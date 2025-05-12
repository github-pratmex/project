// src/components/UploadForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

function UploadForm() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setPrediction(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select an image file.');
      return;
    }

    setLoading(true);
    setPrediction(null);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'https://sickle-cell.onrender.com/predict/',
        formData,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setPrediction(response.data);
    } catch (err) {
      console.error(err);
      setError('Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button type="submit" disabled={loading}>
        {loading ? 'Predicting...' : 'Submit'}
      </button>

      {error && <div className="error">{error}</div>}

      {prediction && (
        <div className="result">
          <p><strong>Result:</strong> {prediction.result}</p>
          <p><strong>Confidence:</strong> {(prediction.confidence * 100).toFixed(2)}%</p>
        </div>
      )}
    </form>
  );
}

export default UploadForm;
