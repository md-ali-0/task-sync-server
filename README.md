# Task Management System

## 🚀 Project Overview

This **Task Management System** is a full-stack web application designed to help users efficiently **manage tasks**. It includes **user authentication, task creation and management, real-time updates, and advanced features** such as drag-and-drop reordering, role-based access control, and a responsive UI. Built with **ReactJS, NodeJS, Laravel, MySQL**, and **WebSocket** for real-time updates, this system provides a robust and user-friendly solution for task management.

## 📌 Features

### ✅ User Authentication & Profile Management

-   **Sign Up/Login** (JWT Authentication)
-   **Forgot & Reset Password**
-   **View and Edit Profile**
-   **Role-based Access Control** (Admin vs User)

### ✅ Task Management (CRUD Operations)

-   **Create, Read, Update, Delete Tasks**
-   **Task Filtering** (By Status, Due Date)
-   **Task Pagination**
-   **Drag-and-Drop Task Reordering** (using React Beautiful DnD)
-   **Task Activity Log** (track creation, updates, and deletions)

### ✅ Real-time Updates

-   **Real-time Task Updates** (using WebSocket or polling)

### ✅ Additional Features

-   **Responsive UI** (Tailwind CSS/Bootstrap)
-   **Dark Mode Support**
-   **Secure Password Hashing** (bcrypt)
-   **Caching** (Redis for performance optimization)

## 🛠 Tech Stack

**Frontend:** ReactJS, Redux, Tailwind CSS, React Beautiful DnD  
**Backend:** NodeJS (Express.js) or Laravel, JWT, WebSocket (Socket.io for real-time updates), bcrypt  
**Database:** MySQL  
**State Management:** Redux Toolkit  
**Caching:** Redis

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/md-ali-0/task-sync.git
cd task-manager
```

### 2️⃣ Install Dependencies

#### Frontend

```bash
cd frontend
npm install  # or yarn install
```

#### Backend

```bash
cd backend
npm install  # or yarn install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file in the backend directory with:

```env
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

### 4️⃣ Run the Application

#### Backend

```bash
cd backend
npm run dev
```

#### Frontend

```bash
cd frontend
npm run dev
```

The app will be available at **`http://localhost:3000`**.

## 📌 API Endpoints

### 🛠 Authentication

-   `POST /auth/register` – Register new users
-   `POST /auth/login` – User login & return JWT
-   `GET /auth/profile` – Get user profile
-   `PUT /auth/profile` – Update user profile
-   `POST /auth/forgot-password` – Request password reset link
-   `POST /auth/reset-password` – Reset password with token

### 🛠 Task Management (Protected Routes)

-   `GET /tasks` – Get all tasks for authenticated user
-   `GET /tasks/:id` – Get task details
-   `POST /tasks` – Create a new task
-   `PUT /tasks/:id` – Update task
-   `DELETE /tasks/:id` – Delete task

## 🔐 Security Measures

-   **JWT Authentication** for protected routes
-   **bcrypt Password Hashing**
-   **Validation & Error Handling**

## 🔐 Credentials

### User:

-   Email: ali@gmail.com
-   Password: 123456

## 🚀 Deployment

-   **Frontend Deployment**: [Frontend Live URL](https://task-sync-ashen.vercel.app)
-   **Backend Deployment**: [Backend Live URL](https://task-sync-server-seven.vercel.app)

## 📜 License

This project is **MIT Licensed**.

---

### 💡 Need Help?

Feel free to open an issue or contribute to the project!
For queries or support, reach out via [Mohammad Ali](mailto:mohammad..98482@gmail.com). or the project repository.

---

🔥 **Happy Coding!** 🚀
