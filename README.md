# 💼 Job Board Platform

A modern, full-featured job board platform that connects job seekers with employers. Built with **Next.js** for the frontend and **Express/Node.js** for the backend.

## 🚀 Features

- 🔐 User Authentication (Job Seekers & Employers)
- 📝 Job Management (Post, Edit, Delete)
- 🔎 Advanced Job Search (Filters for job type, location, etc.)
- 📄 Resume Upload & Apply to Jobs
- 📊 Employer Dashboard for Application Management
- 🧑‍💼 Candidate Dashboard to Track Applications
- 📱 Responsive Mobile-Friendly UI

## 🧭 Project Structure

### 🔷 Frontend (Next.js)

\`\`\`
frontend/
├── app/                    # Next.js App Router
│   ├── auth/               # Authentication pages
│   ├── components/         # Reusable components
│   ├── employers/          # Employer-specific pages
│   ├── candidates/         # Candidate-specific pages
│   ├── jobs/               # Job-related pages
│   └── page.tsx            # Home page
├── public/                 # Static assets
└── package.json            # Frontend dependencies
\`\`\`

### 🔶 Backend (Express.js)

\`\`\`
backend/
├── config/                 # Configuration files
├── controllers/            # Route controllers
├── middleware/             # Custom middleware
├── models/                 # Database models
├── routes/                 # API routes
└── index.js                # Main server file
\`\`\`

## 🛠️ Tech Stack

### 🌐 Frontend
- Next.js
- React + TypeScript
- Tailwind CSS
- React Icons
- Axios

### 🔧 Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (Authentication)
- Bcrypt (Password Hashing)
- Multer (File Uploads)

## 🔌 API Endpoints

### 🔐 Authentication
- \`POST /api/auth/register\` – Register new user  
- \`POST /api/auth/login\` – Login  
- \`GET /api/auth/me\` – Get current user info  

### 📋 Jobs
- \`GET /api/jobs\` – Get all jobs  
- \`GET /api/jobs/:id\` – Get job by ID  
- \`POST /api/jobs\` – Create job (Employer only)  
- \`PUT /api/jobs/:id\` – Update job (Owner/Admin)  
- \`DELETE /api/jobs/:id\` – Delete job (Owner/Admin)  

### 📄 Applications
- \`POST /api/applications\` – Submit application  
- \`GET /api/applications\` – Get all applications  
- \`GET /api/applications/:id\` – Get application by ID  
- \`PUT /api/applications/:id\` – Update application status (Employer only)  
- \`DELETE /api/applications/:id\` – Withdraw application (Candidate only)

## 📬 Contact

📧 lakshyajivani1212@gmail.com  
🔗 [GitHub Repo](https://github.com/jivanilakshya/job-board)
