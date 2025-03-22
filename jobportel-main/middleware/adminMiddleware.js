// Middleware to restrict access to admin users only
const adminAuth = (req, res, next) => {
  // Check if the authenticated user's role is not 'admin'
  if (req.user.role !== 'admin') {
    // If the user is not an admin, return a 403 Forbidden response
    return res.status(403).json({ error: 'Access denied. Admins only' });
  }
  
  // If the user is an admin, proceed to the next middleware or route handler
  next();
};

// Export the middleware so it can be used in other parts of the application
module.exports = adminAuth;
