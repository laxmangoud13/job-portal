Job Portal Backend
Project Overview
This is the backend of a Job Portal Application, built using Node.js, Express, MongoDB, and WebSockets.
It provides secure authentication, job posting, resume management, and real-time updates for job seekers and recruiters.

Features
User Authentication
Register and Login with JWT-based authentication
Role-based access control (User & Admin)
Job Management
Admins can post new jobs
Users can view and apply for jobs
Filter jobs by title
Resume Management
Users can upload resumes (PDF/DOCX)
Resumes are stored in the /uploads/resumes/ directory
Real-time Updates (WebSockets)
Broadcast new job listings to connected clients via WebSockets
Tech Stack
Backend: Node.js, Express.js
Database: MongoDB (Mongoose)
Authentication: JSON Web Token (JWT)
File Uploads: Multer
Real-time Updates: WebSockets
Security Enhancements: Helmet, CORS, Express-rate-limit
Environment Variables
To run this project, create a .env file in the root directory and add the following environment variables: MONGO_URI=your_mongodb_connection_string DATABASE_URL=your_postgresql_connection_string , JWT_SECRET=your_jwt_secret_key

⚙️ Installation and Setup
Clone the Repository
git clone https://github.com/your-username/job-portal-backend.git
cd job-portal-backend
** Install Dependencies**
npm install
** Set Up Environment Variables**
Create a .env file in the root directory and add the following:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
** Start the Server**
npm start
The backend will run on http://localhost:5000/.

Project Structure
job-portal-backend/
│── config/                 # Database configuration
│── middleware/             # Authentication & file upload middleware
│── models/                 # Mongoose models (User, Job)
│── routes/                 # API routes (Auth, Jobs)
│── uploads/resumes/        # Resume upload directory
│── server.js               # Main Express server
│── .env                    # Environment variables
│── package.json            # Project dependencies
│── README.md               # Project documentation
API Documentation
** Authentication Routes**
Method	Endpoint	Description
POST	/auth/register	Register a new user (with resume upload)
POST	/auth/login	Authenticate user & get JWT token
GET	/auth/resume/:userId	Fetch a user's resume
** Register a User**
URL: POST /auth/register
Body (multipart/form-data, resume as a file):
{
  "username": "john_doe",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "9876543210",
  "email": "john@example.com",
  "password": "Password@123",
  "skills": ["React", "Node.js"],
  "dob": "1995-06-15",
  "role": "user"
}
Response (201 - Created):
{
  "message": "User registered successfully",
  "user": {
    "username": "john_doe",
    "email": "john@example.com",
    "resumeUrl": "/uploads/resumes/1712345678-resume.pdf"
  }
}
** User Login**
URL: POST /auth/login
Body:
{
  "email": "john@example.com",
  "password": "Password@123"
}
Response (200 - OK):
{
  "token": "your_jwt_token",
  "role": "user"
}
** Fetch Resume**
URL: GET /auth/resume/:userId
Response: PDF/DOCX file download
** Job Routes**
Method	Endpoint	Description
POST	/jobs/	(Admin only) Post a new job
GET	/jobs/	Get all jobs (Filter by title)
GET	/jobs/:id	Get job details by ID
POST	/jobs/:id/apply	Apply for a job
