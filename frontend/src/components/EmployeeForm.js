import React, { useState, useEffect } from 'react';
import { getEmployeeImageUrl, handleImageError } from '../utils/imageHelper';

const EmployeeForm = ({ employee, onSubmit, onCancel, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date_of_birth: '',
    address: '',
    image: null
  });
  const [preview, setPreview] = useState('');
  const [errors, setErrors] = useState({});

  function convertDate(oldDate) {
    const date = new Date(oldDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Ensure 2-digit month
    const day = date.getDate().toString().padStart(2, "0"); // Ensure 2-digit day
    
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        date_of_birth: convertDate(employee.date_of_birth) || '',
        address: employee.address || '',
        image: ''
      });
      setPreview(employee.image ? getEmployeeImageUrl(employee.image) : '');
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (!/^[a-zA-Z\s]+$/.test(formData.name)) newErrors.name = 'Only letters and spaces allowed';

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);

    if (formData.date_of_birth) {
      formDataToSend.append('date_of_birth', formData.date_of_birth);
    }

    if (formData.address) {
      formDataToSend.append('address', formData.address);
    }
    formDataToSend.append('image', formData.image);

    try {
      await onSubmit(formDataToSend);
      onClose();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      <div className="form-group">
        <label>Name*</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label>Email*</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label>Date of Birth</label>
        <input
          type="date"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleChange}
          className="date-input"
        />
      </div>

      <div className="form-group">
        <label>Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {(preview || (employee?.image && !formData.image)) && (
          <div className="image-preview">
            <img
              src={preview || `http://localhost:5000${employee.image}`}
              alt="Preview"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/default.png';
              }}
            />
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {employee ? 'Update' : 'Create'} Employee
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;