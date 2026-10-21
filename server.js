const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());


let books = [
  { id: 1, title: "Noli Me Tangere", author: "Jose Rizal", year: 1887 },
  { id: 2, title: "El Filibusterismo", author: "Jose Rizal", year: 1891 },
  { id: 3, title: "Clean Code", author: "Robert C. Martin", year: 2008 },
];
let nextId = 4;

const CURRENT_YEAR = new Date().getFullYear();


function validateBook(body, requireAll) {
  const errors = [];
  const { title, author, year } = body || {};

  if (requireAll || title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      errors.push("title is required and must be a non-empty string");
    }
  }
  if (requireAll || author !== undefined) {
    if (typeof author !== "string" || author.trim() === "") {
      errors.push("author is required and must be a non-empty string");
    }
  }
  if (requireAll || year !== undefined) {
    if (!Number.isInteger(year) || year < 0 || year > CURRENT_YEAR) {
      errors.push(`year is required and must be an integer between 0 and ${CURRENT_YEAR}`);
    }
  }
  return errors;
}

function findBook(idParam) {
  const id = Number(idParam);
  if (!Number.isInteger(id)) return { id: null, index: -1 };
  return { id, index: books.findIndex((b) => b.id === id) };
}




app.get("/", (req, res) => {
  res.json({
    status: "running",
    message: "Books API is up. Try GET /api/books",
  });
});


app.get("/api/books", (req, res) => {
  let result = books;
  if (req.query.author) {
    const q = String(req.query.author).toLowerCase();
    result = books.filter((b) => b.author.toLowerCase().includes(q));
  }
  res.status(200).json({ count: result.length, data: result });
});


app.get("/api/books/:id", (req, res) => {
  const { index } = findBook(req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: `Book with id '${req.params.id}' not found` });
  }
  res.status(200).json(books[index]);
});


app.post("/api/books", (req, res) => {
  const errors = validateBook(req.body, true);
  if (errors.length > 0) {
    return res.status(400).json({ error: "Validation failed", details: errors });
  }
  const { title, author, year } = req.body;
  const newBook = { id: nextId++, title: title.trim(), author: author.trim(), year };
  books.push(newBook);
  res.status(201).json(newBook);
});


app.put("/api/books/:id", (req, res) => {
  const { index } = findBook(req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: `Book with id '${req.params.id}' not found` });
  }
  const errors = validateBook(req.body, true);
  if (errors.length > 0) {
    return res.status(400).json({ error: "Validation failed", details: errors });
  }
  const { title, author, year } = req.body;
  books[index] = { id: books[index].id, title: title.trim(), author: author.trim(), year };
  res.status(200).json(books[index]);
});


app.patch("/api/books/:id", (req, res) => {
  const { index } = findBook(req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: `Book with id '${req.params.id}' not found` });
  }
  const body = req.body || {};
  const provided = ["title", "author", "year"].filter((f) => body[f] !== undefined);
  if (provided.length === 0) {
    return res.status(400).json({
      error: "Validation failed",
      details: ["Provide at least one of: title, author, year"],
    });
  }
  const errors = validateBook(body, false);
  if (errors.length > 0) {
    return res.status(400).json({ error: "Validation failed", details: errors });
  }
  const current = books[index];
  books[index] = {
    id: current.id,
    title: body.title !== undefined ? body.title.trim() : current.title,
    author: body.author !== undefined ? body.author.trim() : current.author,
    year: body.year !== undefined ? body.year : current.year,
  };
  res.status(200).json(books[index]);
});


app.delete("/api/books/:id", (req, res) => {
  const { index } = findBook(req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: `Book with id '${req.params.id}' not found` });
  }
  const [removed] = books.splice(index, 1);
  res.status(200).json({ message: "Book deleted successfully", deleted: removed });
});



app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});


app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON in request body" });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
