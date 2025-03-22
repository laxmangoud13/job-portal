const mongoose = require('mongoose'); // Import Mongoose for MongoDB interaction

// Define the schema for job postings
const JobSchema = new mongoose.Schema({
  // Job title (e.g., "Software Engineer")
  title: { type: String, required: true },

  // Job description providing details about the role
  description: { type: String, required: true },

  // Company name offering the job
  company: { type: String, required: true },

  // Job location (e.g., city or remote)
  location: { type: String, required: true },

  // Array to store references to users who applied for the job
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

// Export the Job model to use in other parts of the application
module.exports = mongoose.model('Job', JobSchema);
