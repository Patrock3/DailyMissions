const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

const db = new sqlite3.Database('database.db');

// Initialize tables if they don't exist
const initQueries = [`
CREATE TABLE IF NOT EXISTS pat_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    deleted INTEGER DEFAULT 0
)`, `
CREATE TABLE IF NOT EXISTS pat_missions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_user_id INTEGER,
    to_user_id INTEGER,
    description TEXT,
    rank TEXT,
    created_at TEXT,
    deadline TEXT,
    is_complete INTEGER,
    deleted INTEGER
)`];

initQueries.forEach(q => db.run(q));

// Users endpoints
app.get('/api/pat_users', (req, res) => {
  db.all('SELECT * FROM pat_users WHERE deleted = 0', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/pat_users', (req, res) => {
  const { name, email } = req.body;
  db.run('INSERT INTO pat_users (name, email, deleted) VALUES (?, ?, 0)', [name, email], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
});

// Missions endpoints
app.get('/api/pat_missions', (req, res) => {
  const params = [];
  let query = `SELECT m.*, fu.name as from_user_name, fu.email as from_user_email,
               tu.name as to_user_name, tu.email as to_user_email
               FROM pat_missions m
               LEFT JOIN pat_users fu ON fu.id = m.from_user_id
               LEFT JOIN pat_users tu ON tu.id = m.to_user_id
               WHERE m.deleted = 0`;
  if (req.query.to_user_id) {
    query += ' AND m.to_user_id = ?';
    params.push(req.query.to_user_id.replace(/^eq\./, ''));
  }
  query += ' ORDER BY datetime(m.created_at) DESC';

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/pat_missions', (req, res) => {
  const { from_user_id, to_user_id, description, rank, created_at, deadline, is_complete, deleted } = req.body;
  db.run(`INSERT INTO pat_missions (from_user_id, to_user_id, description, rank, created_at, deadline, is_complete, deleted)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [from_user_id, to_user_id, description, rank, created_at, deadline, is_complete ? 1 : 0, deleted ? 1 : 0],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    });
});

app.patch('/api/pat_missions/:id', (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
  const values = Object.values(updates);
  if (!fields) return res.status(400).json({ error: 'No updates provided' });

  const sql = `UPDATE pat_missions SET ${fields} WHERE id = ?`;
  values.push(id);
  db.run(sql, values, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
