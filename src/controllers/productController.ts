// Using 'import type' ensures these are only used for the compiler and don't break CommonJS logic
import type { Request, Response, NextFunction } from 'express';

const Product = require("../models/Product");
const Category = require("../models/Category");
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
        // 1. Logic for URL-friendly slug
        if (req.body.name && !req.body.slug) {
            req.body.slug = req.body.name
                .toLowerCase()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-');
        }

        // 2. Marketplace Security: Verify Category exists
        if (req.body.category) {
            const categoryExists = await Category.findById(req.body.category);
            if (!categoryExists) {
                return res.status(400).json({ success: false, message: "Invalid Category ID" });
            }
        }

        // 3. Attach logged-in seller ID
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
        if (req.user?.role !== 'admin' || req.user?.role !== 'seller') {
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


/**
 * @desc    Get all products belonging to the logged-in seller (All statuses)
 * @route   GET /api/products/seller/me
 * @access  Private/Seller
 */
exports.getSellerProducts = async (req: any, res: Response, next: NextFunction) => {
    try {
        const Product = require("../models/Product");
        
        // 1. Filter strictly by the logged-in seller's ID
        // Unlike the public route, we do NOT filter by status: 'active' here.
        const query: Record<string, any> = { seller: req.user.id };

        // 2. Add optional status filtering if provided in query params (e.g., ?status=pending)
        if (req.query.status) {
            query.status = req.query.status;
        }

        const products = await Product.find(query)
            .populate('category', 'name')
            .sort({ createdAt: -1 }) // Show newest products first
            .lean();

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
};