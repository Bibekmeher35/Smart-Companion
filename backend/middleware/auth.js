import jwt from "jsonwebtoken";

/**
 * Middleware function to authenticate JWT tokens in incoming requests.
 * Extracts the token from the Authorization header, verifies it, and attaches the user data to the request object.
 */
export const authenticateToken = (req, res, next) => {
  // Get token from "Authorization: Bearer <token>" header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // If no token is provided, return 401 Unauthorized
  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  // Verify the token using the secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // If verification fails (invalid or expired), return 403 Forbidden
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    
    // Attach the decoded user information to the request object for use in subsequent routes
    req.user = user;
    next(); // Pass control to the next middleware or route handler
  });
};

