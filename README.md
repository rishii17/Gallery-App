# Media Gallery Management System

A full-stack MERN (MongoDB, Express.js, React, Node.js) application designed as a complete media management solution. It features secure user authentication with OTP, a powerful media gallery with drag-and-drop uploads, and an integrated contact management system with a dedicated admin panel.

---

## ✨ Core Features

### 🔑 Authentication & Security

* **User Registration:** Secure sign-up with password hashing.
* **Login System:** JWT-based authentication to protect user sessions.
* **Forgot Password:** Secure password reset functionality using a one-time password (OTP) sent via email (Nodemailer).
* **Protected Routes:** Middleware ensures that only authenticated users can access sensitive routes.
* **Admin Role:** A distinct admin role with elevated privileges, managed directly in the database.

### 🖼️ Media Gallery

* **Drag & Drop Upload:** Intuitive multi-file upload interface using React Dropzone.
* **Cloudinary Integration:** All media is uploaded directly to Cloudinary for robust, cloud-based storage.
* **Gallery View:** A responsive grid layout to display all user-uploaded images.
* **Image Management:** Users can delete their own images.
* **Bulk Operations:** Select multiple images to download them as a single `.zip` file.
* **Search & Filter:** Instantly filter the gallery by image title or tags.
* **Image Viewer:** Click on any image to view it in a full-screen modal with its title, description, and tags.

### 📨 Contact & Admin Panel

* **Contact Form:** Authenticated users can send messages directly to the admin.
* **Message History:** Users can view and delete their own sent messages.
* **Admin Dashboard:** A dedicated and protected admin page to manage the platform.
* **User Management (Admin):** Admins can view all registered users and edit their profiles (name, email, role) or delete them.
* **Message Management (Admin):** Admins can view all messages sent by all users and have the ability to delete all messages at once.

---

## 🛠️ Tech Stack

| Category         | Technology                                                              |
| ---------------- | ----------------------------------------------------------------------- |
| **Frontend** | React, Zustand (for state management), React Router, Tailwind CSS, Axios |
| **Backend** | Node.js, Express.js                                                     |
| **Database** | MongoDB (with Mongoose)                                                 |
| **Authentication** | JSON Web Tokens (JWT), bcrypt.js                                  |
| **File Storage** | Cloudinary                                                              |
| **Email Service** | Nodemailer (for OTP)                                                    |
| **File Handling** | Multer (for server-side processing), Archiver (for zipping files)       |

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js (v18.x or higher)
* npm or yarn
* MongoDB (either a local instance or a free Atlas account)
* A Cloudinary account
* A Gmail account with an "App Password" for Nodemailer

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <project-folder>
```
2. Backend Setup
Bash

# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file in the backend root and add the variables from the template below
touch .env

# Start the backend server
npm run dev

The server will be running on http://localhost:5000.

3. Frontend Setup
Bash

# Navigate to the frontend directory from the root
cd frontend

# Install dependencies
npm install

# Create a .env file in the frontend root and add the VITE_API_URL variable
touch .env

# Start the frontend development server
npm run dev
The application will be available at http://localhost:5173.

⚙️ Environment Variables
You will need to create two .env files for this project to run.

backend/.env
Code snippet

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# MongoDB Connection String (from MongoDB Atlas)
MONGO_URI=<your_mongodb_connection_string>

# JWT Configuration
JWT_SECRET=<your_long_random_jwt_secret>
JWT_EXPIRES_IN=1d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>

# Nodemailer (Gmail for OTP)
# IMPORTANT: Use an "App Password" for your Google Account, not your regular password.
GMAIL_USER=<your_gmail_address>
GMAIL_PASS=<your_gmail_app_password>
frontend/.env
Code snippet

# The URL of your running backend server
VITE_API_URL=http://localhost:5000/api

