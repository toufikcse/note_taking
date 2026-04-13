# 📝 Secure Note-Taking API

A RESTful API for a secure note-taking application built with **Node.js, Express, TypeScript, MongoDB (Mongoose)**, and **JWT authentication**.

---

## 🚀 Features

### 🔐 Authentication

- User registration & login
- JWT-based authentication
- Secure password hashing (bcrypt)

### 👤 Roles & Permissions (RBAC)

- **User**
  - Create, update, delete, and view their own notes
- **Admin**
  - All user permissions
  - Manage users (CRUD)
  - View all notes

### 📝 Notes

- Full CRUD operations
- Pagination support
- Access control (own vs all)

### 📊 Aggregation

- Group users by interests
- Get user posts using `$lookup`

### ⚡ Performance

- Optimized MongoDB indexing
- Efficient queries with pagination

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcrypt

---

## 📂 Project Structure
