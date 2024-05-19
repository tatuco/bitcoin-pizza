const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./pizzas.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS pizzas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      cookTime INTEGER,
      type TEXT,
      addedTime INTEGER,
      status INTEGER
    )
  `);
});

module.exports = db;
