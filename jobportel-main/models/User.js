const mongoose = require('mongoose'); // Import Mongoose for MongoDB interaction

// Define the schema for user data
const UserSchema = new mongoose.Schema({
  // Unique username for the user
  username: { type: String, required: true, unique: true },

  // First name of the user
  firstName: { type: String, required: true },

  // Last name of the user
  lastName: { type: String, required: true },

  // Contact phone number of the user
  phoneNumber: { type: String, required: true },

  // Unique email ID for the user
  email: { type: String, required: true, unique: true },

  // Hashed password of the user (to be stored securely)
  password: { type: String, required: true },

  // Array to store user's skills (e.g., ['JavaScript', 'React'])
  skills: { type: [String], default: [] },

  // URL to the user's uploaded resume file
  resumeUrl: { type: String, default: '' },

  // Date of Birth of the user
  dob: { type: Date, required: true },

  // Role of the user: either 'user' (default) or 'admin'
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

// Export the User model to use in other parts of the application
module.exports = mongoose.model('User', UserSchema);
