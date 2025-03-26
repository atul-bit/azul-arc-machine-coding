import React, { useState, useContext } from 'react';
import { EmployeeContext } from '../context/EmployeeContext';
import EmployeeForm from './EmployeeForm';
import Modal from './Modal';

const EmployeeList = () => {
  const { employees, loading, error, deleteEmployee, updateEmployee, createEmployee } = useContext(EmployeeContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(id);
      } catch (err) {
        alert('Failed to delete employee');
      }
    }
  };

  const handleEdit = (employee) => {
    setCurrentEmployee(employee);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentEmployee(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentEmployee(null);
  };

  function convertDateFormat (oldDate) {
    const date = new Date(oldDate);
    const formattedDate = date.toLocaleDateString("en-GB"); // dd/mm/yyyy format
    return formattedDate;
  }

  if (loading) return <div className="loading">Loading employees...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <div className="employee-list">
      <button onClick={handleAdd} className="btn-primary">Add Employee</button>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Date of Birth</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{convertDateFormat(employee.date_of_birth) || '-'}</td>
              <td>
                {employee.image ? (
                  <img
                    src={`http://localhost:5000${employee.image}`}
                    alt={employee.name}
                    width="50"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/default.png';
                    }}
                  />
                ) : (
                  <img
                    src="/assets/default.png"
                    alt="No employee photo"
                    width="50"
                  />
                )}
              </td>
              <td>
                <button onClick={() => handleEdit(employee)} className="btn-secondary">
                  Edit
                </button>
                <button onClick={() => handleDelete(employee.id)} className="btn-primary">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2>{currentEmployee ? 'Edit Employee' : 'Add Employee'}</h2>
        <EmployeeForm
          employee={currentEmployee}
          onSubmit={currentEmployee ?
            (data) => updateEmployee(currentEmployee.id, data) :
            createEmployee}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default EmployeeList;