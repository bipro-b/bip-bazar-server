// Using 'import type' ensures these are only used for the compiler and don't break CommonJS logic
import type { Request, Response, NextFunction } from 'express';

const Product = require("../models/Product");
const ProductService = require("../services/productService");

/**
 * @desc    Get all products with advanced filtering
 */
exports.getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await ProductService.queryProducts(req.query);
        res.status(200).json({ 
            success: true, 
            count: data.products?.length || 0,
            ...data 
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create new product (Seller only)
 */
// Using 'any' for req because we add 'user' to it in our custom auth middleware
exports.createProduct = async (req: any, res: Response, next: NextFunction) => {
    try {
        if (req.body.name && !req.body.slug) {
            req.body.slug = req.body.name
                .toLowerCase()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-');
        }

        const productData = { 
            ...req.body, 
            seller: req.user?.id 
        };

        const product = await Product.create(productData);
        
        res.status(201).json({ 
            success: true, 
            message: "Product created and pending approval",
            data: product 
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update product details
 */
exports.updateProduct = async (req: any, res: Response, next: NextFunction) => {
    try {
        let query: Record<string, any> = { _id: req.params.id };
        if (req.user?.role !== 'admin') {
            query.seller = req.user?.id;
        }

        const product = await Product.findOneAndUpdate(
            query,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found or unauthorized" 
            });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Bulk Update Stock (Inventory Sync)
 */
exports.bulkStockUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { updates } = req.body; 
        const result = await ProductService.bulkUpdateStock(updates);
        
        res.status(200).json({ 
            success: true, 
            modifiedCount: result.modifiedCount,
            message: "Inventory synced successfully" 
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete Product
 */
exports.deleteProduct = async (req: any, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findOneAndDelete({ 
            _id: req.params.id, 
            seller: req.user?.id 
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ success: true, message: "Product removed" });
    } catch (error) {
        next(error);
    }
};