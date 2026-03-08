const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

db.run(`
CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  author TEXT
)
`);

/* Add Book */
app.post("/add-book", (req, res) => {

  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({
      error: "Title and Author required"
    });
  }

  db.run(
    "INSERT INTO books(title, author) VALUES(?, ?)",
    [title, author],
    function (err) {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Book added successfully",
        id: this.lastID
      });

    }
  );
});

/* Get Books */
app.get("/books", (req, res) => {

  db.all("SELECT * FROM books", [], (err, rows) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json(rows);

  });

});

/* Delete Book */
app.delete("/delete-book/:id", (req, res) => {

  const id = req.params.id;

  db.run(
    "DELETE FROM books WHERE id = ?",
    [id],
    function (err) {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Book removed successfully"
      });

    }
  );

});

/* Start Server */
app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});