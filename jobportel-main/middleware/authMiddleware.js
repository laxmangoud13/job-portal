const jwt = require('jsonwebtoken'); // Import the JSON Web Token (JWT) library

// Middleware to authenticate users using JWT
const authenticate = (req, res, next) => {
  // Retrieve the token from the request headers
  const token = req.header('Authorization');

  // If no token is provided, return a 401 Unauthorized response
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    // Verify the token after removing the 'Bearer ' prefix
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);

    // Attach the decoded user data to the request object for use in protected routes
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // If token verification fails, return a 400 Bad Request response
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Export the middleware so it can be used in other parts of the application
module.exports = authenticate;
