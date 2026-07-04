# 🛒 E-Commerce Website

A full-stack E-Commerce web application that allows users to browse products, manage carts, place orders, and securely authenticate accounts. The platform includes an admin panel for managing products, orders, and users.

---

# 🚀 Features

## User Features

* User Registration & Login
* JWT Authentication
* Browse Products
* Search & Filter Products
* Product Details Page
* Add to Cart
* Wishlist Management
* Place Orders
* Order History
* User Profile Management

## Admin Features

* Admin Dashboard
* Add/Edit/Delete Products
* Manage Categories
* Manage Orders
* Manage Users
* Sales Analytics

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router DOM
* Redux Toolkit

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Bcrypt.js
* Multer

---

# 📂 Project Structure

```bash
ecommerce-website/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/ecommerce-website.git
cd ecommerce-website
```

---

# 🔥 Frontend Setup

Navigate to Frontend Folder

```bash
cd frontend
```

Install Dependencies

```bash
npm install
```

Start Development Server

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# 🔥 Backend Setup

Navigate to Backend Folder

```bash
cd backend
```

Install Dependencies

```bash
npm install
```

Create `.env` File

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173
```

Start Backend Server

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

# 📡 API Endpoints

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

## Products

```http
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

## Cart

```http
GET    /api/cart
POST   /api/cart/add
DELETE /api/cart/remove/:id
```

## Orders

```http
POST /api/orders
GET  /api/orders/myorders
GET  /api/orders
```

---

# 🗄️ Database Schema

## User

```javascript
{
  name: String,
  email: String,
  password: String,
  role: String
}
```

## Product

```javascript
{
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  stock: Number
}
```

## Order

```javascript
{
  user: ObjectId,
  products: Array,
  totalAmount: Number,
  status: String
}
```

---

# 🔐 Authentication

The application uses:

* JWT (JSON Web Token)
* Password Hashing with Bcrypt
* Protected Routes
* Role-Based Access Control (Admin/User)

---

# 📸 Screenshots

Add screenshots here:

```markdown
![Home Page](screenshots/home.png)
![Product Page](screenshots/product.png)
![Admin Dashboard](screenshots/admin.png)
```

---

# 🌟 Future Enhancements

* Payment Gateway Integration (Stripe/Razorpay)
* Product Reviews & Ratings
* Email Notifications
* AI Product Recommendations
* Multi-Vendor Support
* Real-Time Order Tracking

---

# 🤝 Contributing

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push to GitHub

```bash
git push origin feature-name
```

5. Create a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Gautam Kumar Singh**

B.Tech Artificial Intelligence & Machine Learning

Full Stack Web Developer

GitHub: https://github.com/yourusername
