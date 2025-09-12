const express = require('express');
const router = express.Router();
const { 
  getCart, 
  addToCart, 
  removeFromCart, 
  updateCartQuantity, 
  clearCart, 
  syncCart 
} = require('../controllers/cartController');
const jwt = require('jsonwebtoken');

// Cookie-based authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please login.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// All cart routes require authentication
router.use(authenticate);

// Get user's cart
router.get('/', getCart);

// Add item to cart
router.post('/add', addToCart);

// Remove item from cart
router.delete('/remove/:productId', removeFromCart);

// Update item quantity in cart
router.put('/update/:productId', updateCartQuantity);

// Clear entire cart
router.delete('/clear', clearCart);

// Sync localStorage cart with database cart
router.post('/sync', syncCart);

module.exports = router;