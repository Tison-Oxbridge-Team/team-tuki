/**
 * Middleware to handle errors globally.
 * @param {Object} err - The error object.
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {Function} next - Next middleware function.
 */
function errorHandler(err, req, res, next) {
    console.error(err.stack); // Log the error stack trace for debugging

    // Respond with a generic error message
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Include stack trace only in development
    });
}

module.exports = errorHandler;