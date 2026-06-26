const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
    // Initialize tables if they don't exist
    initializeTables();
  }
});

function initializeTables() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'student',
      department TEXT,
      photo TEXT,
      prn TEXT,
      study_year TEXT,
      dob TEXT,
      phone TEXT,
      blood_group TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS idcards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_uuid TEXT UNIQUE NOT NULL,
      user_id INTEGER REFERENCES users(id),
      id_number TEXT NOT NULL,
      issue_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      expiry_date DATETIME NOT NULL,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS verification_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_uuid TEXT REFERENCES idcards(id_uuid),
      result TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  });
}

module.exports = {
  query: (text, params = []) => {
    return new Promise((resolve, reject) => {
      // Convert Postgres $1, $2 style to SQLite ? if needed, 
      // but we will update the controllers directly for clarity.
      db.all(text, params, (err, rows) => {
        if (err) {
            console.error('Database Query Error:', err);
            reject(err);
        } else {
            resolve({ rows });
        }
      });
    });
  },
  run: (text, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(text, params, function(err) {
        if (err) {
            console.error('Database Run Error:', err);
            reject(err);
        } else {
            resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
  }
};
