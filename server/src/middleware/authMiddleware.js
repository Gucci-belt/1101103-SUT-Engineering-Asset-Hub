const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) return res.status(401).json({ error: 'Access token required' });

    // --- TEMPORARY: Allow Mock Token from Clerk Frontend ---
    if (token.startsWith('mock-clerk-token-')) {
        const userId = token.replace('mock-clerk-token-', '');
        req.user = {
            id: userId, // In real app, we need to map Clerk ID to DB ID here
            role: 'student',
            studentId: 'ClerkUser'
        };
        return next();
    }
    // -------------------------------------------------------

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token' });
        req.user = user;
        next();
    });
};

exports.authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Admin access required' });
    }
};
