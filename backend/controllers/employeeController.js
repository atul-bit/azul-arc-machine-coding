const Employee = require('../models/employeeModel');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const upload = require('../middlewares/fileUpload');

const calculateAge = (dob) => {
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const EmployeeController = {
  async createEmployee(req, res) {
    try {
    
        const { name, email, date_of_birth, address } = req.body;
        
    // Basic validation
    if (!name || !email) {
        // Clean up uploaded file if validation fails
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'Name and email are required' });
      }
  
      // Check if email already exists
      const existingEmployee = await Employee.findByEmail(email);
      if (existingEmployee) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'Email already exists' });
      }
    
        // Process the image path
        let imagePath = null;
        if (req.file) {
            imagePath = '/public/uploads/' + req.file.filename
        }
    
        // Create employee record
        const newEmployee = await Employee.create({
          name,
          email,
          date_of_birth,
          address,
          image: imagePath
        });
    
        res.status(201).json(newEmployee);
      } catch (error) {
        // Clean up file if error occurs
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: error.message });
      }
  },

  async getAllEmployees(req, res) {
    try {
      const employees = await Employee.findAll();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getEmployeeById(req, res) {
    try {
      const employee = await Employee.findById(req.params.id);
      if (!employee) return res.status(404).json({ error: 'Employee not found' });
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateEmployee(req, res) {
    try {
        const { id } = req.params;
        const { name, email, date_of_birth, address } = req.body;
        
        // Get current employee data
        const currentEmployee = await Employee.findById(id);
        if (!currentEmployee) {
          // Clean up uploaded file if employee not found
          if (req.file) fs.unlinkSync(req.file.path);
          return res.status(404).json({ error: 'Employee not found' });
        }
    
        // Handle image update
        let imagePath = currentEmployee.image;
        if (req.file) {
          // Delete old image if it exists
          if (currentEmployee.image) {
            const oldImagePath = path.join(__dirname, '../public', currentEmployee.image);
            if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
          }
          // Set new image path
          imagePath = '/public/uploads/' + req.file.filename;
        }
    
        // Update employee record
        const updatedEmployee = await Employee.update(id, {
          name,
          email,
          date_of_birth,
          address,
          image: imagePath
        });
    
        res.json(updatedEmployee);
      } catch (error) {
        // Clean up file if error occurs
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: error.message });
      }
  },

  async deleteEmployee(req, res) {
    try {
      const employee = await Employee.findById(req.params.id);
      if (!employee) return res.status(404).json({ error: 'Employee not found' });
      
      if (employee.image) {
        const imagePath = path.join(__dirname, '../public', employee.image);
        if (fs.existsSync(imagePath)) await unlinkAsync(imagePath);
      }
      
      await Employee.delete(req.params.id);
      res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = EmployeeController;