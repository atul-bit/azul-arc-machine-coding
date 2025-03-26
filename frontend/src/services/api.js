import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchEmployees = async () => {
  const response = await axios.get(`${API_URL}/employees`);
  return response.data;
};

export const fetchEmployeeById = async (id) => {
  const response = await axios.get(`${API_URL}/employees/${id}`);
  return response.data;
};

export const createEmployee = async (employee) => {
  const formData = new FormData();
  
  Object.keys(employee).forEach(key => {
    if (employee[key] !== null && employee[key] !== undefined) {
      formData.append(key, employee[key]);
    }
  });

  const response = await axios.post(`${API_URL}/employees`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateEmployee = async (id, employee) => {
  const formData = new FormData();
  
  Object.keys(employee).forEach(key => {
    if (employee[key] !== null && employee[key] !== undefined) {
      formData.append(key, employee[key]);
    }
  });

  const response = await axios.put(`${API_URL}/employees/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteEmployee = async (id) => {
  await axios.delete(`${API_URL}/employees/${id}`);
};