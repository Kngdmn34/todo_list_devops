const path = require('path');
const express = require('express');
const cors = require('cors');
const todoRoutes = require('./routes/todos');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/todos', todoRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = app;
