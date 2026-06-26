const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const queries = [
  `ALTER TABLE users ADD COLUMN prn TEXT`,
  `ALTER TABLE users ADD COLUMN study_year TEXT`,
  `ALTER TABLE users ADD COLUMN dob TEXT`,
  `ALTER TABLE users ADD COLUMN phone TEXT`,
  `ALTER TABLE users ADD COLUMN blood_group TEXT`,
  `ALTER TABLE users ADD COLUMN address TEXT`
];

db.serialize(() => {
  console.log('Starting migration to update table schema...');
  queries.forEach(query => {
    db.run(query, (err) => {
      if (err) {
        if (err.message.includes('duplicate column name')) {
          console.log(`Column from query [${query}] already exists, skipping...`);
        } else {
          console.error(`Error running query [${query}]:`, err.message);
        }
      } else {
        console.log(`Executed: ${query}`);
      }
    });
  });
});

db.close((err) => {
  if (err) console.error('Error closing database:', err.message);
  else console.log('Migration complete.');
});
