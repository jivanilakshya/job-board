# Job Board Platform

A modern job board platform that connects job seekers with employers, built with Next.js for the frontend and Express/Node.js for the backend.

## Features

- **User Authentication**: Secure login and registration for both job seekers and employers
- **Job Management**: Post, edit, and delete job listings
- **Job Search**: Advanced search functionality with filters for job type, location, etc.
- **Application Process**: Apply for jobs with resume upload functionality
- **Employer Dashboard**: Manage job listings and review applications
- **Candidate Dashboard**: Track job applications and save interesting jobs
- **Responsive Design**: Mobile-friendly user interface

## Project Structure

The project is divided into two main folders:

### Frontend (Next.js)

```
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
```

### Backend (Express.js)

```
backend/
├── config/                 # Configuration files
├── controllers/            # Route controllers
├── middleware/             # Custom middleware
├── models/                 # Database models
├── routes/                 # API routes
└── index.js                # Main server file
```

## Technologies Used

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- React Icons
- Axios

### Backend
- Node.js
- Express.js
- MongoDB/Mongoose
- JSON Web Tokens (JWT)
- Bcrypt
- Multer (for file uploads)

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/job-board.git
   cd job-board
   ```

2. Install dependencies for both frontend and backend:
   ```
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/job-board
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   ```

4. Start the development servers:
   ```
   # Start backend server
   cd backend
   npm run dev

   # In a new terminal, start frontend server
   cd frontend
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user info

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get a specific job
- `POST /api/jobs` - Create a new job (Employer only)
- `PUT /api/jobs/:id` - Update a job (Job owner or Admin)
- `DELETE /api/jobs/:id` - Delete a job (Job owner or Admin)

### Applications
- `POST /api/applications` - Submit job application
- `GET /api/applications` - Get all applications for a user
- `GET /api/applications/:id` - Get a specific application
- `PUT /api/applications/:id` - Update application status (Employer only)
- `DELETE /api/applications/:id` - Withdraw application (Application owner only)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- UI components inspired by [Tailwind UI](https://tailwindui.com/)