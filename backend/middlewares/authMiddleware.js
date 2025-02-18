const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;

if (!secretKey) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
}

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token
    if (!token) {
        return res.status(401).json({ message: 'Access denied. Invalid token format.' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token.' });

        req.user = user; // Attach the user object to the request
        next();
    });
};

// Middleware to verify if the user is an admin
const authenticateAdmin = (req, res, next) => {
    authenticateToken(req, res, () => {  // ✅ Call authenticateToken first
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }
        next();
    });
};

module.exports = { authenticateToken, authenticateAdmin };
