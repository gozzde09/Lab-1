const path = require("path");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Client } = require("pg");

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const client = new Client({
  connectionString: process.env.PGURI,
});
client.connect();

// GET - languages
app.get("/api/languages", async (req, res) => {
  try {
    const { rows } = await client.query("SELECT id, name FROM languages");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching languages:", error);
  }
});

// GET - Hämta alla böcker med språk
app.get("/api/books", async (_req, res) => {
  try {
    const { rows } = await client.query(
      `SELECT books.id,
         books.title,
         books.author,
         books.language_id,
         languages.name AS language
  FROM books
  JOIN languages ON books.language_id = languages.id;`
    );
    res.send(rows);
  } catch (error) {
    console.error("Error fetching books:", error);
  }
});

// POST - Lägg till en ny bok
app.post("/api/books", async (req, res) => {
  const { title, author, language_id } = req.body;
  try {
    const { rows } = await client.query(
      "INSERT INTO books (title, author, language_id) VALUES ($1, $2, $3) RETURNING *",
      [title, author, language_id]
    );
    res.status(201).send(rows[0]);
  } catch (error) {
    console.error("Error adding book:", error);
  }
});

// PUT - Uppdatera en bok
app.put("/api/books/:id", async (req, res) => {
  const { id } = req.params;
  const { title, author, language_id } = req.body;
  try {
    const { rows } = await client.query(
      "UPDATE books SET title = $1, author = $2, language_id = $3 WHERE id = $4 RETURNING *",
      [title, author, language_id, id]
    );
    res.status(200).send(rows[0]);
  } catch (error) {
    console.error("Error updating book:", error);
  }
});

// DELETE - Ta bort en bok
app.delete("/api/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await client.query("DELETE FROM books WHERE id = $1", [id]);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).send("Server error");
  }
});

// Serve frontend files
app.use(express.static(path.join(path.resolve(), "dist")));
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server kör på http://localhost:${port}`);
});
