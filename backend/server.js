const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();

// ✅ Render için PORT tanımı
const PORT = process.env.PORT || 3001;

// ✅ CORS ve JSON middleware
app.use(cors());
app.use(express.json());

// ✅ SQLite veritabanı dosyası
const db = new sqlite3.Database('./database.db');

// ✅ TABLOLARI oluştur
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    creator_id INTEGER,
    category TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    project_id INTEGER
  )
`);

// ✅ KULLANICI kayıt
app.post('/register', (req, res) => {
  const { name, email } = req.body;
  db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], function (err) {
    if (err) return res.status(500).send(err.message);
    res.json({ id: this.lastID });
  });
});

// ✅ PROJE oluşturma
app.post('/projects', (req, res) => {
  const { title, description, creator_id, category } = req.body;
  db.run(
    'INSERT INTO projects (title, description, creator_id, category) VALUES (?, ?, ?, ?)',
    [title, description, creator_id, category],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.json({ id: this.lastID });
    }
  );
});

// ✅ TÜM projeleri getirme
app.get('/projects', (req, res) => {
  db.all('SELECT * FROM projects', (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

// ✅ BAŞVURU yapma
app.post('/apply', (req, res) => {
  const { user_id, project_id } = req.body;
  db.run(
    'INSERT INTO applications (user_id, project_id) VALUES (?, ?)',
    [user_id, project_id],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.json({ id: this.lastID });
    }
  );
});

// ✅ TÜM başvuruları listeleme
app.get('/applications', (req, res) => {
  db.all(
    `
    SELECT applications.id, users.name AS user_name, projects.title AS project_title
    FROM applications
    JOIN users ON applications.user_id = users.id
    JOIN projects ON applications.project_id = projects.id
  `,
    (err, rows) => {
      if (err) return res.status(500).send(err.message);
      res.json(rows);
    }
  );
});

// ✅ Backend çalıştır
app.listen(PORT, () => {
  console.log(`✅ Backend is working: http://localhost:${PORT}`);
});