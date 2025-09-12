const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  addToWishlist,
  removeFromWishlist,
  getAllUsers
} = require('../controllers/userController');

const { protect, authorize, loginLimiter, checkResourceOwnership } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginLimiter, loginUser);

// Protected routes (require authentication)
router.use(protect); // All routes below this middleware require authentication

// Profile routes
router.route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile);

router.put('/change-password', changePassword);

// Address routes
router.route('/addresses')
  .post(addAddress);

router.route('/addresses/:addressId')
  .put(updateAddress)
  .delete(deleteAddress);

// Cart routes
router.route('/cart')
  .post(addToCart)
  .delete(clearCart);

router.route('/cart/:productId')
  .put(updateCartItem)
  .delete(removeFromCart);

// Wishlist routes
router.route('/wishlist')
  .post(addToWishlist);

router.route('/wishlist/:productId')
  .delete(removeFromWishlist);

// Admin routes (no auth middleware as requested)
router.get('/admin/all', getAllUsers); // GET /api/users/admin/all - Get all users (admin)

module.exports = router;