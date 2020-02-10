const db = require('../cat_modules/db').load();

module.exports = {
  findOrCreate(discordId, name) {
    const sql = `INSERT OR IGNORE INTO users (discordId, name, admin)
                 VALUES (?, ?, ?)`;

    db.run(sql, [discordId, name, 0]);

    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE discordId = ?`, [discordId], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }
}