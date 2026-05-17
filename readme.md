# 🚀 Express + PostgreSQL REST API

A simple RESTful API built with **Express.js**, **TypeScript**, and **PostgreSQL (NeonDB)** for managing users.

---

## 📦 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (via [NeonDB](https://neon.tech))
- **DB Client**: `pg` (node-postgres)

---

## 🗄️ Database Schema

```sql
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(20),
  email      VARCHAR(20) UNIQUE NOT NULL,
  password   VARCHAR(20) NOT NULL,
  is_active  BOOLEAN DEFAULT true,
  age        INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔌 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the server

```bash
npx ts-node index.ts
```

Server starts at: `http://localhost:3000`

---

## 📡 API Endpoints

### Base URL

```
http://localhost:3000
```

---

### `GET /`

Health check — returns server info.

**Response**
```json
{
  "massage": "Express server",
  "author": "next level"
}
```

---

### `POST /api/users`

Create a new user.

**Request Body** (JSON)
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "age": 25
}
```

**Response** `201`
```json
{
  "message": "User created successfully",
  "data": { ...user }
}
```

---

### `GET /api/users`

Retrieve all users.

**Response** `200`
```json
{
  "success": true,
  "message": "Users retrived successfully!",
  "data": [ ...users ]
}
```

---

### `GET /api/users/:id`

Retrieve a single user by ID.

**Response** `200`
```json
{
  "success": true,
  "message": "Users retrived successfully!",
  "data": [ ...user ]
}
```

**Not Found** `404`
```json
{
  "success": false,
  "message": "Users not found!",
  "data": {}
}
```

---

### `PUT /api/users/:id`

Update a user by ID. All fields are optional — only provided fields will be updated (`COALESCE`).

**Request Body** (JSON)
```json
{
  "name": "Jane Doe",
  "password": "newpass",
  "age": 30,
  "is_active": false
}
```

**Response** `200`
```json
{
  "success": true,
  "message": "Users data Updated successfully!",
  "data": { ...updatedUser }
}
```

---

### `DELETE /api/users/:id`

Delete a user by ID.

**Response** `200`
```json
{
  "success": true,
  "message": "User delete successfully!"
}
```

**Not Found** `404`
```json
{
  "success": false,
  "message": "User not found for delete!"
}
```

---

## 📋 Supported Request Body Formats

Express is configured to parse the following content types:

| Format | Middleware |
|--------|-----------|
| JSON | `express.json()` |
| Plain Text | `express.text()` |
| URL Encoded (with nested objects) | `express.urlencoded({ extended: true })` |

---

## ⚠️ Notes

- `email` must be **unique** in the database.
- `extended: true` in `urlencoded` is required to support nested object data in form submissions.
- Passwords are stored as plain text in this version — consider hashing with **bcrypt** in production.
- Make sure to store your DB connection string in a `.env` file and use `dotenv` — never hardcode credentials.

---

## 📁 Project Structure

```
.
├── index.ts        # Main server file
├── package.json
└── tsconfig.json
```