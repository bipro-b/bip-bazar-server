import type { Request, Response, NextFunction } from 'express';
const UserService = require("../services/userService");
const User = require("../models/User")
exports.register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.registerUser(req.body);
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await UserService.loginUser(email, password);
        
        res.status(200).json({ 
            success: true, 
            token, 
            role: user.role,
            name: user.name 
        });
    } catch (error) {
        next(error);
    }
};

exports.getProfile = async (req: any, res: Response, next: NextFunction) => {
    try {
        // req.user is populated by AuthMiddleware
        const User = require("../models/User");
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};


/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/users/admin/all
 */
exports.getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Amazon-style: Use the query method from service to handle pagination/filtering
        const data = await UserService.queryUsers(req.query);
        
        res.status(200).json({ 
            success: true, 
            count: data.users.length,
            ...data 
        });
    } catch (error) {
        next(error);
    }
};

exports.verifyOTP = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { code, type } = req.body; // type: 'email' or 'phone'
        const user = await User.findById(req.user.id);

        if (!user || user.verificationMethods.otp.code !== code) {
            return res.status(400).json({ success: false, message: "Invalid OTP code" });
        }

        if (new Date() > user.verificationMethods.otp.expiresAt) {
            return res.status(400).json({ success: false, message: "OTP has expired" });
        }

        // Update verification status based on type
        if (type === 'email') {
            user.verificationMethods.emailVerified = true;
        } else if (type === 'phone') {
            user.verificationMethods.phoneVerified = true;
        }

        // If both are verified (or just the required one), mark user as verified
        user.isVerified = true; 
        
        // Clear OTP after use
        user.verificationMethods.otp = undefined;
        await user.save();

        res.status(200).json({ success: true, message: `${type} verified successfully` });
    } catch (error) {
        next(error);
    }
};