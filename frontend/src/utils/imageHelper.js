// src/utils/ImageHelper.js
export const getEmployeeImageUrl = (imagePath) => {
    if (!imagePath) return '/assets/no-image.png';
    if (imagePath.startsWith('blob:')) return imagePath; // For local previews
    if (imagePath.startsWith('http')) return imagePath;
    return `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}${imagePath}`;
  };
  
  export const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = '/assets/no-image.png';
  };