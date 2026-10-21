# Books API

A simple RESTful API for managing a collection of books, built with Node.js and Express.js.
Created for **ITPE101 – Integrative Programming & Technology** (Laboratory Activity: Building, Testing, and Deploying a RESTful API).

## Technologies Used
- Node.js
- Express.js
- Postman (API testing)
- GitHub (version control)
- Render (deployment)

## Installation and Local Execution
1. Clone the repository:
   ```bash
   git clone YOUR_GITHUB_REPOSITORY_URL
   cd books-api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open `http://localhost:3000` – you should see an API status message.

The server uses `process.env.PORT` and falls back to port `3000` locally.

## Endpoints

| Method | Route            | Purpose                                         | Success Code |
|--------|------------------|-------------------------------------------------|--------------|
| GET    | `/`              | API status check                                | 200 |
| GET    | `/api/books`     | Retrieve all books (optional `?author=` filter) | 200 |
| GET    | `/api/books/:id` | Retrieve one book by ID                         | 200 |
| POST   | `/api/books`     | Create a new book                               | 201 |
| PUT    | `/api/books/:id` | Replace a book's fields (all fields required)   | 200 |
| PATCH  | `/api/books/:id` | Partially update a book                         | 200 |
| DELETE | `/api/books/:id` | Delete a book                                   | 200 |

**Error responses:** `400` (validation failed / invalid JSON), `404` (book or route not found), `500` (server error). All responses are JSON.

## Book Fields
| Field    | Type    | Rules |
|----------|---------|-------|
| `id`     | number  | Auto-generated, unique |
| `title`  | string  | Required, non-empty |
| `author` | string  | Required, non-empty |
| `year`   | integer | Required, 0 up to the current year |

## Example Request Body (POST /api/books)
```json
{
  "title": "The Pragmatic Programmer",
  "author": "Andrew Hunt",
  "year": 1999
}
```

Example response (`201 Created`):
```json
{
  "id": 4,
  "title": "The Pragmatic Programmer",
  "author": "Andrew Hunt",
  "year": 1999
}
```

## Testing with Postman
Import `Books-API.postman_collection.json` into Postman. It uses a `baseUrl` collection variable
(default `http://localhost:3000`) – change it to your Render URL to test the deployed API.
The collection covers both successful and unsuccessful requests.

## Links
- **GitHub Repository:** https://github.com/your-username/your-repository
- **Render Deployment:** https://your-service-name.onrender.com

## Known Limitations
- Data is stored in an **in-memory array**, so it is temporary. Records are lost whenever the server restarts or the Render instance is replaced/spun down.
- No authentication or database.
- Render's free tier may take ~30–60 seconds to wake up on the first request after inactivity.
