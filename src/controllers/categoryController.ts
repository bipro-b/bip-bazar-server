import type { Request, Response, NextFunction } from 'express';
const Category = require("../models/Category");

exports.createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, image } = req.body;
        
        // Generate slug from name
        const slug = name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
        
        const category = await Category.create({
            name,
            slug,
            description,
            image
        });

        res.status(201).json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
};

exports.getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await Category.find({ status: 'active' });
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        next(error);
    }
};