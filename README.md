# 🚀 Jashpur Express — Delivery Website

A full-stack delivery/e-commerce web application built for **Jashpur** city. Customers can browse products by category, add items to cart, place orders, and track them. Admins can manage products, categories, and orders through a dedicated dashboard.

---

## 📸 Features

| Feature | Description |
|---------|-------------|
| 🏠 **Home Page** | Browse products with category sidebar, search & filter |
| 🛒 **Cart System** | Add/remove items, adjust quantities, checkout flow |
| 👤 **User Auth** | Register, login, JWT-based authentication |
| 📦 **Order Management** | Place orders, track status, order history |
| 🔧 **Admin Dashboard** | Add/edit/delete products & categories, manage orders |
| 📱 **Responsive Design** | Works on mobile, tablet, and desktop |
| 🖼️ **Image Uploads** | Product image uploads via Multer |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Atlas) |
| **Auth** | JWT (JSON Web Tokens), bcryptjs |
| **File Upload** | Multer |

---

## 📁 Project Structure

```
delivery_website/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Login, Register, Admin auth
│   │   ├── categoryController.js
│   │   ├── orderController.js
│   │   └── productController.js
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verification
│   │   └── uploadMiddleware.js  # Multer config for image uploads
│   ├── models/
│   │   ├── Category.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   └── productRoutes.js
│   ├── .env.example            # Environment variable template
│   ├── package.json
│   └── server.js               # Express server entry point
├── public/
│   ├── css/
│   │   └── style.css           # Global styles
│   ├── js/
│   │   ├── admin.js            # Admin dashboard logic
│   │   ├── auth.js             # Login/Register UI logic
│   │   ├── cart.js             # Cart & checkout logic
│   │   ├── main.js             # Home page product loading
│   │   └── product.js          # Single product page
│   ├── uploads/                # User-uploaded product images
│   ├── admin.html              # Admin dashboard
│   ├── cart.html               # Cart & checkout page
│   ├── index.html              # Home page
│   └── product.html            # Single product detail page
├── .gitignore
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites

- **Node.js** (v18 or higher) — [Download](https://nodejs.org/)
- **MongoDB Atlas** account (free tier works) — [Sign up](https://www.mongodb.com/atlas)
- **Git** — [Download](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/delivery_website.git
cd delivery_website
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Set Up Environment Variables

```bash
# Copy the example env file
cp .env.example .env
```

Now open `backend/.env` and fill in your values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<your_username>:<your_password>@<cluster>.mongodb.net/<db_name>
JWT_SECRET=any_random_secret_string
JWT_EXPIRES_IN=30d
ADMIN_SECRET_EMAIL=admin@yoursite.com
ADMIN_SECRET_PASSWORD=your_secure_password
```

### 4. Run the Server

```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

### 5. Open in Browser

```
http://localhost:5000
```

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/admin-login` | Admin login |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (Admin) |
| PUT | `/api/products/:id` | Update product (Admin) |
| DELETE | `/api/products/:id` | Delete product (Admin) |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| POST | `/api/categories` | Create category (Admin) |
| DELETE | `/api/categories/:id` | Delete category (Admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get all orders (Admin) |
| GET | `/api/orders/my` | Get user's orders |
| POST | `/api/orders` | Place new order |
| PUT | `/api/orders/:id/status` | Update order status (Admin) |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |

---

## 🤝 Contributing

1. **Fork** this repository
2. **Create** a feature branch: `git checkout -b feature/my-feature`
3. **Commit** your changes: `git commit -m "Add my feature"`
4. **Push** to the branch: `git push origin feature/my-feature`
5. **Open** a Pull Request

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Rupa Banjara** — [@rupabanjara25](https://github.com/rupabanjara25)

---

> Built with ❤️ for Jashpur