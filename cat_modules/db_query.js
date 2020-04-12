const db = require('./db').load();

module.exports = {
  run(sql, errMsg) {
    return new Promise((resolve, reject) => {
      db.run(sql, function(err) {
        if (err) reject(err);
        if (this.changes > 0) {
          resolve({
            success: true,
            message: "That's all done for you."
          });
        } else {
          resolve({
            success: false,
            message: errMsg || "Something didn't quite go to plan, was the command definitely correct?"
          });
        }
      });
    });
  },

  all(sql, format) {
    return new Promise((resolve, reject) => {
      db.all(sql, (err, rows) => {
        if (err) reject(err);
        if (rows && rows.length > 0) {
          resolve({
            success: true,
            message: `Here's what I found:\n\n${module.exports.formats[format].format(rows)}`
          });
        } else {
          resolve({
            success: false,
            message: `I was unable to find anything.`
          });
        }
      });
    });
  },

  get(sql) {
    return new Promise((resolve, reject) => {
      db.get(sql, (err, row)=>{
        if (err) reject(err);
        resolve(row)
      });
    });
  },

  getAll(sql) {
    return new Promise((resolve, reject) => {
      db.all(sql, (err, rows)=>{
        if (err) reject(err);
        resolve(rows)
      });
    });
  },

  formats: {
    users: {
      format(rows) {
        return rows.map((row) => {
          return `• **DiscordID:** ${row.discordId}, **Name:** ${row.name}, **Sellers:** ${row.sellers}, **Listings:** ${row.listings}`;
        }).join("\n");
      }
    },
    sellers: {
      format(rows) {
        return rows.map((row) => {
          return `• [${row.id}] **Name:** ${row.name}, **Listings:** ${row.listings}`;
        }).join("\n");
      }
    },
    listings: {
      format(rows) {
        return rows.map((row) => {
          return `• [${row.id}]  **${row.location || row.name}** is selling **${row.item}** for **${row.price}**`;
        }).join("\n");
      }
    }
  }
}