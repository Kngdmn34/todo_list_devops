const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Get all todos
router.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
  res.json(rows);
});

// Create a todo
router.post('/', async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const { rows } = await pool.query(
    'INSERT INTO todos (title) VALUES ($1) RETURNING *',
    [title]
  );
  res.status(201).json(rows[0]);
});

// Toggle complete
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query(
    'UPDATE todos SET completed = NOT completed WHERE id = $1 RETURNING *',
    [id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

// Delete
router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM todos WHERE id = $1', [req.params.id]);
  res.status(204).send();
});

module.exports = router;
