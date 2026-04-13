# 🛒 Grocery Booking System API

A simple backend system built with **Node.js, Express, PostgreSQL, and Prisma ORM**.

---

## 🚀 Features

- 🔐 Authentication (Register/Login with JWT)
- 🛠️ Admin:
  - Add grocery items
  - Update items
  - Delete items
  - Manage inventory

- 👤 User:
  - View available items
  - Place multi-item orders

---

## 🧰 Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- TypeScript

---

## 📦 Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

### 2️⃣ Install dependencies

```bash
npm install
```

---

### 3️⃣ Setup environment variables

Create a `.env` file in root directory:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/grocery_booking_system"
JWT_SECRET="your_secret_key"
PORT=5000
```

---

### 4️⃣ Setup database

Make sure PostgreSQL is running.

Then run:

```bash
npx prisma migrate dev
```

---

### 5️⃣ Generate Prisma client

```bash
npx prisma generate
```

---

### 6️⃣ Run the server

```bash
npm run dev
```

Server will start at:

```
http://localhost:5000
```

---

## 🔐 API Base URL

```
http://localhost:5000/api/grocery/v1
```

---

## 📌 Example APIs

### 🔐 Auth

- POST `/auth/register`
- POST `/auth/login`

### 🛠️ Admin

- POST `/admin/items`
- GET `/admin/items`
- PUT `/admin/items/:id`
- DELETE `/admin/items/:id`

### 👤 User

- GET `/user/items`
- POST `/user/orders`

---

## 🧪 Testing

Use:

- Postman

---

## ⚠️ Notes

- Use JWT token for protected routes
- Admin routes require `ADMIN` role

---

## 👨‍💻 Author

Toufikur Rahman Toufik
