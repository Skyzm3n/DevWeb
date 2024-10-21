var sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "./database/database.db";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Ne peut pas ouvrir db
    console.error(err.message);
    throw err;
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS urls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      original_url TEXT NOT NULL,
      short_url TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      visits INTEGER DEFAULT 0
    )`, (err) => {
    if (err) {
      console.error('Erreur lors de la création de la table:', err.message);
    } else {
      console.log('Table "urls" créée ou déjà existante.');
    }
  });

  }
});

module.exports = db;
