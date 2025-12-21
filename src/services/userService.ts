const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserService = {
    /**
     * Register a new user with Amazon-style profile separation
     */
    async registerUser(userData: any) {
        // 1. Hash password for security
        if (userData.password) {
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);
        }

        // 2. Generate shopSlug if the role is seller
        if (userData.role === 'seller' && userData.sellerProfile?.shopName) {
            userData.sellerProfile.shopSlug = userData.sellerProfile.shopName
                .toLowerCase()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-');
        }

        return await User.create(userData);
    },

    /**
     * Login logic with JWT generation
     */
    async loginUser(email: string, password: string) {
        const user = await User.findOne({ email }).select("+password");
        if (!user) throw new Error("Invalid credentials");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid credentials");

        // Generate Token
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET || 'secret', 
            { expiresIn: '30d' }
        );

        return { user, token };
    },

    /**
     * Advanced Admin Query
     * Filter by role, verification status, or membership level
     */
    async queryUsers(filters: any) {
        const { role, isVerified, city, page = 1, limit = 20 } = filters;
        let query: Record<string, any> = { status: 'active' };

        if (role) query.role = role;
        if (isVerified) query.isVerified = isVerified === 'true';
        if (city) query["addresses.city"] = city;

        const skip = (page - 1) * limit;
        const users = await User.find(query).skip(skip).limit(Number(limit)).lean();
        const total = await User.countDocuments(query);

        return { users, total, pages: Math.ceil(total / limit) };
    }
};

module.exports = UserService;