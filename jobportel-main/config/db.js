const mongoose = require('mongoose'); // Importing Mongoose to interact with MongoDB

// Function to connect to the MongoDB database
const connectDB = async () => {
  try {
    // Attempt to establish a connection to MongoDB using the provided connection string from environment variables
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // Enables the new URL parser
      useUnifiedTopology: true, // Ensures the use of the latest server discovery and monitoring engine
    });

    // Log a success message if the connection is successful
    console.log('MongoDB Connected');
  } catch (err) {
    // Log an error message if the connection fails
    console.error('MongoDB Connection Error:', err);
    
    // Exit the application with a failure status to indicate an issue with the database connection
    process.exit(1);
  }
};

// Export the function so it can be used in other parts of the application
module.exports = connectDB;
