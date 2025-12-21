const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

/**
 * IMPORT MIDDLEWARES
 * Note: You will need to create 'protect' and 'authorize' to 
 * secure these Amazon-scale features.
 */
// const { protect, authorize } = require("../middlewares/authMiddleware");

/**
 * @ROUTE   /api/products
 */

// 1. PUBLIC DISCOVERY (Amazon-style search and filtering)
// Logic handled in productService.queryProducts
router.get("/", productController.getAllProducts);

// 2. SELLER/ADMIN ACTIONS (Product Management)
// Using 'protect' ensures req.user.id is available for the controller
router.post(
    "/", 
    // protect, 
    // authorize('seller', 'admin'), 
    productController.createProduct
);

// 3. BULK OPERATIONS (Inventory Syncing for Dropshipping)
// Scalable endpoint for updating thousands of stock levels
router.post(
    "/bulk-stock", 
    // protect, 
    // authorize('seller'), 
    productController.bulkStockUpdate
);

/**
 * @ROUTE   /api/products/:id
 */

router
    .route("/:id")
    .patch(
        // protect, 
        // authorize('seller', 'admin'), 
        productController.updateProduct
    )
    .delete(
        // protect, 
        // authorize('seller', 'admin'), 
        productController.deleteProduct
    );

module.exports = router;