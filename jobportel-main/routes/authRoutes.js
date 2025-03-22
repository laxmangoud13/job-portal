const express = require('express'); // Import Express framework
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import JSON Web Token for authentication
const multer = require('multer'); // Import Multer for handling file uploads
const path = require('path'); // Import Path module for working with file paths
const fs = require('fs'); // Import File System module for handling files
const User = require('../models/User'); // Import User model

const router = express.Router(); // Initialize Express router

// Ensure the directory for storing resume uploads exists
const uploadDir = path.join(__dirname, '../uploads/resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if it does not exist
}

// Multer configuration for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Specify upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Rename file with timestamp to prevent conflicts
  },
});

// Initialize Multer with storage configuration
const upload = multer({ storage });

// Route to register a new user with an optional resume upload
router.post('/register', upload.single('resume'), async (req, res) => {
  try {
    // Extract user details from the request body
    const { username, firstName, lastName, phoneNumber, email, password, skills, dob, role } = req.body;

    // Validate that all required fields are provided
    if (!username || !firstName || !lastName || !phoneNumber || !email || !password || !dob) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store the uploaded resume file path if provided
    const resumeUrl = req.file ? `/uploads/resumes/${req.file.filename}` : null;

    // Create a new user instance
    const user = new User({ 
      username, 
      firstName, 
      lastName, 
      phoneNumber, 
      email, 
      password: hashedPassword, 
      skills, 
      dob, 
      role, 
      resumeUrl 
    });

    // Save the user to the database
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    res.status(500).json({ error: 'Registration failed' }); // Handle errors
  }
});

// Route for user login
router.post('/login', async (req, res) => {
  try {
    // Extract login credentials from the request body
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // If the user does not exist or the password is incorrect, return an error
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token with user ID and role
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return the token and user role
    res.json({ token, role: user.role });

  } catch (err) {
    res.status(500).json({ error: 'Login failed' }); // Handle errors
  }
});

// Route to fetch the resume of a specific user by ID
router.get('/resume/:userId', async (req, res) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.params.userId);

    // If the user or their resume does not exist, return an error
    if (!user || !user.resumeUrl) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Send the resume file to the client
    res.sendFile(path.resolve(__dirname, `..${user.resumeUrl}`));

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resume' }); // Handle errors
  }
});

// Export the router so it can be used in the main application
module.exports = router;
