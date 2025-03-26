import React from 'react';
import { useEmployees } from '../context/EmployeeContext';
import EmployeeList from '../components/EmployeeList';
import EmployeeForm from '../components/EmployeeForm';
import Modal from '../components/Modal';

const EmployeesPage = () => {
  const {
    employees,
    loading,
    error,
    isModalOpen,
    currentEmployee,
    openModal,
    closeModal,
    addEmployee,
    editEmployee,
    removeEmployee,
  } = useEmployees();

  const handleSubmit = async (employeeData) => {
    try {
      if (currentEmployee) {
        await editEmployee(currentEmployee.id, employeeData);
      } else {
        await addEmployee(employeeData);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      await removeEmployee(id);
    }
  };

  return (
    <div className="employees-page">
      <div className="page-header">
        <h1>Employee Management</h1>
        <button onClick={() => openModal()} className="btn-add">
          Add Employee
        </button>
      </div>

      <EmployeeList
        employees={employees}
        loading={loading}
        error={error}
        onEdit={openModal}
        onDelete={handleDelete}
      />

      <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
        <h2>{currentEmployee ? 'Edit Employee' : 'Add New Employee'}</h2>
        <EmployeeForm
          employee={currentEmployee}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default EmployeesPage;