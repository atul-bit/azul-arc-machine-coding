const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/employeeController');
const { validateEmployee } = require('../middlewares/validation');
const upload = require('../middlewares/fileUpload');

// Create employee with file upload
router.post('/employees',
    upload.single('image'), // Handle single file upload
    validateEmployee,
    EmployeeController.createEmployee
);

// Update employee with optional file upload
router.put('/employees/:id',
    upload.single('image'), // Same middleware for updates
    validateEmployee,
    EmployeeController.updateEmployee
);

router.get('/employees', EmployeeController.getAllEmployees);
router.get('/employees/:id', EmployeeController.getEmployeeById);
router.delete('/employees/:id', EmployeeController.deleteEmployee);

module.exports = router;