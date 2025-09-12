const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrder,
  getOrdersByEmail,
  updateOrderStatus,
  getAllOrders
} = require('../controllers/orderController');

// Public routes
router.post('/', createOrder);                    // POST /api/orders - Create new order
router.get('/:identifier', getOrder);            // GET /api/orders/:id - Get order by ID or order number
router.get('/customer/:email', getOrdersByEmail); // GET /api/orders/customer/:email - Get orders by customer email

// Admin routes (you can add authentication middleware here later)
router.get('/', getAllOrders);                   // GET /api/orders - Get all orders (admin)
router.patch('/:orderId/status', updateOrderStatus); // PATCH /api/orders/:id/status - Update order status (admin)

module.exports = router;