import { type Request, type Response, type NextFunction } from 'express';
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req: any, res: Response, next: NextFunction) => {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized to access this route" });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

        // Attach user to the request object
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Token is invalid or expired" });
    }
};

// Grant access to specific roles (e.g., 'seller', 'admin')
exports.authorize = (...roles: string[]) => {
    return (req: any, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `User role ${req.user.role} is not authorized to access this route` 
            });
        }
        next();
    };
};