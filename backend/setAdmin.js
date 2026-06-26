const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const email = '202501120003@mitaoe.ac.in';

db.run(`UPDATE users SET role = 'admin' WHERE email = ?`, [email], function(err) {
  if (err) {
    console.error('Error updating to admin:', err.message);
  } else if (this.changes > 0) {
    console.log(`Successfully updated ${email} to Admin!`);
  } else {
    console.log(`User ${email} not found.`);
  }
  db.close();
});
