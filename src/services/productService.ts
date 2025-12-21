const Product = require("../models/Product");
const mongoose = require("mongoose");

const ProductService = {
    /**
     * High-Scale Search & Filter
     * Features: Regex search, dynamic range filtering, and Amazon-style sponsored ranking.
     */
    async queryProducts(queryParams: any) {
        const { 
            search, category, brand, minPrice, maxPrice, 
            sort, page = 1, limit = 20 
        } = queryParams;

        // Use Record<string, any> to allow dynamic key assignment for Mongoose queries
        let query: Record<string, any> = { status: 'active' };

        // 1. Intelligent Text Search (Name, Keywords, Tags)
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { searchKeywords: { $in: [new RegExp(search, 'i')] } },
                { tags: { $in: [new RegExp(search, 'i')] } },
                { brand: { $regex: search, $options: 'i' } }
            ];
        }

        // 2. Dynamic Filtering
        if (category) query.category = category;
        if (brand) query.brand = brand;
        
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // 3. Optimized Execution
        const skip = (Math.max(1, page) - 1) * limit;

        // 4. Amazon-Style Sorting (Prioritizes Sponsored Content)
        let sortQuery: Record<string, any> = { isSponsored: -1, adWeight: -1 }; 
        
        if (sort === 'price_low') sortQuery = { price: 1, ...sortQuery };
        else if (sort === 'price_high') sortQuery = { price: -1, ...sortQuery };
        else if (sort === 'top_rated') sortQuery = { "stats.totalOrders": -1, ...sortQuery };
        else sortQuery = { createdAt: -1, ...sortQuery }; 

        // 5. Parallel Querying for Speed
        const [products, total] = await Promise.all([
            Product.find(query)
                .populate('category', 'name')
                .populate('seller', 'shopName')
                .sort(sortQuery)
                .skip(skip)
                .limit(Number(limit))
                .lean(), // lean() returns plain JS objects, 5x faster than Mongoose documents
            Product.countDocuments(query)
        ]);

        return {
            products,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit),
            hasMore: page < Math.ceil(total / limit)
        };
    },

    /**
     * Bulk Inventory & Stock Sync
     * Uses atomic bulkWrite for processing thousands of updates instantly.
     */
    async bulkUpdateStock(updates: { id: string, stock: number }[]) {
        const bulkOps = updates.map(item => ({
            updateOne: {
                filter: { _id: item.id },
                update: { 
                    $set: { 
                        stock: Math.max(0, item.stock),
                        status: item.stock > 0 ? 'active' : 'pending' 
                    } 
                }
            }
        }));

        // ordered: false allows other updates to finish even if one fails
        return await Product.bulkWrite(bulkOps, { ordered: false });
    },

    /**
     * Ranking Engine Utility
     * Updates organic ranking stats based on user interactions.
     */
    async updateProductStats(productId: string, type: 'click' | 'impression' | 'order') {
        const increment: Record<string, number> = {};
        if (type === 'click') increment['stats.totalClicks'] = 1;
        if (type === 'impression') increment['stats.totalImpressions'] = 1;
        if (type === 'order') increment['stats.totalOrders'] = 1;

        return await Product.findByIdAndUpdate(productId, { $inc: increment });
    }
};

module.exports = ProductService;