require('dotenv').config(); // Load environment variables from .env file
const express = require('express'); // Import Express framework
const cors = require('cors'); // Enable Cross-Origin Resource Sharing
const helmet = require('helmet'); // Add security headers
const rateLimit = require('express-rate-limit'); // Prevent excessive API requests
const WebSocket = require('ws'); // Import WebSocket for real-time updates
const connectDB = require('./config/db'); // Import database connection function
const authRoutes = require('./routes/authRoutes'); // Import authentication routes
const path = require('path'); // Import path module for handling file paths

const app = express(); // Initialize Express app

app.use(express.json()); // Enable JSON request body parsing
app.use(cors()); // Enable CORS for cross-origin requests
app.use(helmet()); // Enhance API security

// Connect to MongoDB
connectDB();

// Rate Limiting Middleware (Prevents API Abuse)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Limit requests per 15 minutes
  max: 100, // Maximum requests allowed per IP
  message: 'Too many requests, please try again later.', // Message shown when rate limit is exceeded
});
app.use(limiter);

// Serve Resume Files as Static Assets
app.use('/uploads/resumes', express.static(path.join(__dirname, 'uploads/resumes')));

// WebSocket Server Setup for Real-time Job Updates
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('🔌 New WebSocket connection established');
  ws.send(JSON.stringify({ message: 'Connected to job updates' }));

  ws.on('message', (data) => {
    console.log(`📩 Received message: ${data}`);
  });
});

// Function to Broadcast New Job Listings to WebSocket Clients
const broadcastNewJob = (job) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ event: 'NEW_JOB', job }));
    }
  });
};

// Import job routes and pass WebSocket function for real-time updates
const jobRoutes = require('./routes/jobRoutes')(broadcastNewJob);
app.use('/jobs', jobRoutes);

// API Routes
app.use('/auth', authRoutes);

// Start the Express Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
