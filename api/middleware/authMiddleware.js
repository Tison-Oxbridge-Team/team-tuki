const { verifyToken } = require('../util/jwt'); // JWT helper for token validation

/**
 * Middleware to authenticate and validate JWT.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {Function} next - Next middleware function.
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    // Check if Authorization header exists and is properly formatted
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }

    const token = authHeader.split(' ')[1]; // Extract token after "Bearer"

    try {
        const user = verifyToken(token); // Decode and validate the token
        if (!user) {
            throw new Error('Token verification failed');
        }

        req.user = user; // Attach user info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error(`Authentication Error: ${err.message}`);
        res.status(403).json({ message: 'Invalid or expired token' });
    }
}

/**
 * Middleware to validate if the authenticated user is an admin.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {Function} next - Next middleware function.
 */
function requireAdmin(req, res, next) {
    // Ensure the user object exists and has the correct role
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }

    next(); // Proceed to the next middleware or route handler
}

module.exports = { authenticateToken, requireAdmin };
