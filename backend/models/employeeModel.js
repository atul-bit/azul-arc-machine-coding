const db = require('../config/db');

const Employee = {
  async create(employee) {
    const { name, age, email, date_of_birth, address, image } = employee;
    const result = await db.query(
      'INSERT INTO employees (name, age, email, date_of_birth, address, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, age, email, date_of_birth, address, image]
    );
    return result.rows[0];
  },

  async findAll() {
    const result = await db.query('SELECT * FROM employees ORDER BY created_at DESC');
    return result.rows;
  },

  async findById(id) {
    const result = await db.query('SELECT * FROM employees WHERE id = $1', [id]);
    return result.rows[0];
  },

  async update(id, employee) {
    const { name, age, email, date_of_birth, address, image } = employee;
    const result = await db.query(
      'UPDATE employees SET name = $1, age = $2, email = $3, date_of_birth = $4, address = $5, image = $6 WHERE id = $7 RETURNING *',
      [name, age, email, date_of_birth, address, image, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    await db.query('DELETE FROM employees WHERE id = $1', [id]);
    return true;
  },

  async findByEmail(email) {
    const result = await db.query('SELECT * FROM employees WHERE email = $1', [email]);
    return result.rows[0];
  },
};

module.exports = Employee;