const multer = require('multer'); // Import the Multer library for handling file uploads
const path = require('path'); // Import path module for file path operations

// Configure Multer storage options
const storage = multer.diskStorage({
  // Define the destination folder where uploaded files will be stored
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes/'); // Save uploaded files in the 'uploads/resumes/' directory
  },

  // Define the filename format to ensure uniqueness
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Prefix the filename with a timestamp to avoid conflicts
  }
});

// File type validation middleware to allow only specific file formats
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf', // PDF files
    'application/msword', // DOC files (Microsoft Word)
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // DOCX files (Microsoft Word)
  ];

  // Check if the uploaded file type is allowed
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only PDF and DOCX are allowed.')); // Reject the file with an error
  }
};

// Initialize Multer with the defined storage and file filter
const upload = multer({ storage, fileFilter });

// Export the configured Multer instance for use in route handlers
module.exports = upload;
