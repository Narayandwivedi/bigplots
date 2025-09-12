const express = require('express');
const router = express.Router();
const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} = require('../controllers/addressController');
const jwt = require('jsonwebtoken');

// Authentication middleware for cookie-based auth
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

// All address routes require authentication
router.use(authenticate);

// Get all addresses for user
router.get('/', getAddresses);

// Add new address
router.post('/', addAddress);

// Update existing address
router.put('/:addressId', updateAddress);

// Delete address
router.delete('/:addressId', deleteAddress);

// Set default address
router.patch('/:addressId/default', setDefaultAddress);

module.exports = router;