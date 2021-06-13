const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("./products.db", (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");

    db.run(
      `CREATE TABLE products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name text UNIQUE,
      price double DEFAULT NULL,
      description text,
      view_count int(11) DEFAULT 0, 
      deleted tinyint(1) DEFAULT 0
    )`,
      (err) => {
        if (err) {
          // TABLE already created
        } else {
          // Table created, adding some data for testing
          var insert =
            "INSERT INTO products (name, price, description, view_count, deleted) VALUES (?,?,?,?,?)";
          db.run(insert, ["Product 1", "50.9", "Test Product 1", "11", "0"]);
          db.run(insert, ["Product 2", "1000", "Test Product 2", "2", "0"]);
          db.run(insert, ["Product 3", "250", "Test Product 3", "3", "0"]);
          db.run(insert, ["Product 4", "3089", "Test Product 4", "12", "0"]);
          db.run(insert, ["Product 5", "300", "Test Product 5", "30", "1"]);
          db.run(insert, ["Product 6", "2500", "Test Product 6", "0", "0"]);
        }
      }
    );
  }
});

module.exports = db;
