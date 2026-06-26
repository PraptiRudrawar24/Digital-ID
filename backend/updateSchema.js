const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const queries = [
  `ALTER TABLE users ADD COLUMN dob TEXT`,
  `ALTER TABLE users ADD COLUMN phone TEXT`,
  `ALTER TABLE users ADD COLUMN blood_group TEXT`,
  `ALTER TABLE users ADD COLUMN address TEXT`
];

db.serialize(() => {
  queries.forEach(query => {
    db.run(query, (err) => {
      if (err) console.log('Column might already exist, skipping...');
      else console.log('Column added successfully');
    });
  });
});

db.close();
