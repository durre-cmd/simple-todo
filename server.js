const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('.')); // Serve frontend files

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // replace with your MySQL password
  database: 'todo_app'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database.');
});

// -------------------- ROUTES -------------------- //

// Get all tasks
app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks ORDER BY id DESC', (err, results) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      return res.status(500).send('Error fetching tasks');
    }
    res.json(results);
  });
});

// Add a new task
app.post('/tasks', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send('Task name required');

  db.query('INSERT INTO tasks (name) VALUES (?)', [name], (err, result) => {
    if (err) {
      console.error('Error adding task:', err);
      return res.status(500).send('Error adding task');
    }
    res.json({ id: result.insertId, name });
  });
});

// Edit a task (UPDATE)
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) return res.status(400).send('Task name required');

  db.query('UPDATE tasks SET name = ? WHERE id = ?', [name, id], (err, result) => {
    if (err) {
      console.error('Error updating task:', err);
      return res.status(500).send('Error updating task');
    }
    res.json({ message: 'Task updated successfully' });
  });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting task:', err);
      return res.status(500).send('Error deleting task');
    }
    res.json({ message: 'Task deleted successfully' });
  });
});

// -------------------- START SERVER -------------------- //
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
