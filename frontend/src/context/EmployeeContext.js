import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/employees`);
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createEmployee = async (employeeData) => {
    try {
      const { data } = await axios.post(`${API_URL}/employees`, employeeData);
      setEmployees([data, ...employees]);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const updateEmployee = async (id, employeeData) => {
    try {
      const { data } = await axios.put(`${API_URL}/employees/${id}`, employeeData);
      setEmployees(employees.map(emp => emp.id === id ? data : emp));
      return data;
    } catch (err) {
      throw err;
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`${API_URL}/employees/${id}`);
      setEmployees(employees.filter(emp => emp.id !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        loading,
        error,
        fetchEmployees,
        createEmployee,
        updateEmployee,
        deleteEmployee
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};