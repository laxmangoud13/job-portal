const express = require('express'); // Import Express framework
const Job = require('../models/Job'); // Import Job model for database interactions
const authenticate = require('../middleware/authMiddleware'); // Import authentication middleware
const adminAuth = require('../middleware/adminMiddleware'); // Import admin role check middleware

// Export a function that receives the WebSocket broadcast function
module.exports = (broadcastNewJob) => {
  const router = express.Router(); // Initialize Express router

  // Route to post a new job (Only accessible by Admins)
  router.post('/', authenticate, adminAuth, async (req, res) => {
    try {
      // Extract job details from request body
      const { title, description, company, location } = req.body;

      // Validate that all required fields are provided
      if (!title || !description || !company || !location) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Create a new job document and save it to the database
      const job = new Job(req.body);
      await job.save();

      // Broadcast the newly posted job to WebSocket clients
      if (broadcastNewJob) {
        broadcastNewJob(job);
      }

      // Send success response
      res.status(201).json({ message: 'Job posted successfully', job });
    } catch (err) {
      console.error('Error posting job:', err);
      res.status(500).json({ error: 'Failed to post job' });
    }
  });

  // Route to fetch all jobs with optional filtering by title
  router.get('/', async (req, res) => {
    try {
      const { title } = req.query;
      let query = {};

      // If a title is provided, filter jobs that match it (case-insensitive)
      if (title) {
        query.title = { $regex: title, $options: 'i' };
      }

      // Retrieve jobs from database
      const jobs = await Job.find(query);
      res.json(jobs);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  });

  // Route to fetch job details by ID
  router.get('/:id', async (req, res) => {
    try {
      // Find job by ID
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ error: 'Job not found' });

      // Return job details
      res.json(job);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch job details' });
    }
  });

  // Route to apply for a job (User must be authenticated)
  router.post('/:id/apply', authenticate, async (req, res) => {
    try {
      // Find job by ID
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ error: 'Job not found' });

      // Add the user ID to the list of applicants
      job.applicants.push(req.user.userId);
      await job.save();

      // Send success response
      res.json({ message: 'Applied successfully!' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to apply for job' });
    }
  });

  return router; // Return the configured router
};
