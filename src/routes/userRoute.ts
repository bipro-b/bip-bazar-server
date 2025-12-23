const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect, authorize } = require("../middlewares/authMiddleware"); 

/**
 * IMPORT MIDDLEWARES
 * You will need 'protect' to decode the JWT and 'authorize' to check roles.
 */
// const { protect, authorize } = require("../middlewares/authMiddleware");

/**
 * @ROUTE   POST /api/users/register
 * @DESC    Register a new user (Customer, Seller, or Admin)
 * @ACCESS  Public
 */
router.post("/register", userController.register);

/**
 * @ROUTE   POST /api/users/login
 * @DESC    Authenticate user & get token
 * @ACCESS  Public
 */
router.post("/login", userController.login);

/**
 * @ROUTE   GET /api/users/profile
 * @DESC    Get current logged-in user data
 * @ACCESS  Private (Requires JWT)
 */
router.get(
    "/profile", 
    protect, 
    userController.getProfile
);

router.get(
    "/all",
    userController.getAllUsers
)


router.get(
    "/req-otp", 
    protect, 
    authorize('seller','customer','admin'), 
    userController.requestPhoneOTP
);



router.post(
    "/verify-otp", 
    protect, 
    authorize('seller','customer','admin'), 
    userController.verifyOTP
);


router.get("/customer/profile", protect, userController.getMe);


/**
 * @ROUTE   GET /api/users/admin/all
 * @DESC    Get all users for marketplace management
 * @ACCESS  Private/Admin
 */
// router.get(
//     "/admin/all",
//     // protect,
//     // authorize('admin'),
//     // userController.getAllUsers (You can add this to your controller later)
// );

module.exports = router;