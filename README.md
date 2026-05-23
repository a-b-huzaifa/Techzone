# ⚡ TechZone — Premium MERN E-Commerce Platform

> A full-stack, production-grade e-commerce web application built with the MERN stack, featuring real-time order tracking, Stripe payments, Mock Cash-on-Delivery payment flows, and a premium dark-mode UI.

---

## 🚀 Setup & Execution (Single-Step Startup)

TechZone is configured to run with a single unified configuration file and simple scripts from the root directory.

### Prerequisites
1. **Node.js** v18+ installed.
2. **MongoDB** installed locally (the startup script automatically attempts to start a local database on port `27017` using `--dbpath C:\data\db`). If you prefer MongoDB Atlas, simply update the `MONGO_URI` in the `.env` file.

---

### 1. Configure the Environment
There is a single unified configuration file located in the project root:
📄 **[.env](file:///c:/Users/abhuz/OneDrive/Desktop/new%20project/techzone/.env)**

Ensure the variables are configured correctly:
```env
# Backend Configuration
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/techzone
JWT_SECRET=supersecret_jwt_key_12345
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Frontend Configuration (Vite)
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

*Note: If no Stripe secret key is configured, the application automatically handles checkouts in Cash on Delivery (COD) mode.*

---

### 2. Install Dependencies
Run the install command from the root directory to install all packages for the root, server, and client:
```bash
npm run install-all
```

---

### 3. Seed Database (Optional)
To populate the database with default products and an admin user, run:
```bash
npm run seed --prefix server
```
**Admin Credentials:**
*   **Email:** `admin@techzone.com`
*   **Password:** `admin123`

---

### 4. Run the Application
Start the local MongoDB instance, backend server, and frontend server concurrently:
```bash
npm run dev
```

*   **Frontend Website**: `http://localhost:5173`
*   **Backend Server**: `http://localhost:5000`

---

## ✨ Features

### 🛍️ Customer Features
- **Browse & Filter** — Search, filter by category/brand/price, sort by rating/price/newest.
- **Product Detail** — Image gallery, specs table, customer reviews with star ratings.
- **Smart Cart** — Quantity controls, coupon codes (`TECH10`, `SAVE20`, `WELCOME15`), animated actions.
- **Multi-Step Checkout** — Shipping form, Stripe payments, Cash on Delivery.
- **Order Tracking** — Real-time status tracker (Pending → Processing → Shipped → Delivered).
- **Wishlist** — Save and manage favorite items.
- **Auth** — JWT-secured register/login with HTTP-only cookies.

### 👨‍💼 Admin Panel
- **Dashboard** — Revenue charts, order stats, monthly analytics.
- **Product CRUD** — Add/edit/delete products with stock management.
- **Order Management** — View all orders, update status inline.
- **User Management** — View users, change roles, delete accounts.

### 🎨 UI / UX
- **Premium Dark Theme** — Deep navy base, indigo/cyan neon palette.
- **Glassmorphism** — Frosted glass card UI.
- **Framer Motion** — Smooth page and element animations.
- **Real-time** — Socket.io for live order status notifications.

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register user | Public |
| `POST` | `/api/auth/login` | Login | Public |
| `GET` | `/api/products` | Get products (filters, sort, page) | Public |
| `GET` | `/api/products/:id` | Product detail | Public |
| `POST` | `/api/products` | Create product | Admin |
| `PUT` | `/api/products/:id` | Update product | Admin |
| `DELETE` | `/api/products/:id` | Delete product | Admin |
| `POST` | `/api/orders` | Place order | User |
| `GET` | `/api/orders/my` | My orders | User |
| `GET` | `/api/orders` | All orders | Admin |
| `PUT` | `/api/orders/:id/status` | Update order status | Admin |
| `POST` | `/api/payment/checkout` | Stripe checkout session | User |

---

## 🎭 Demo Coupon Codes
| Code | Discount |
|------|----------|
| `TECH10` | 10% off |
| `SAVE20` | 20% off |
| `WELCOME15` | 15% off |

---

## 📄 License
[MIT](LICENSE) © 2026 TechZone
