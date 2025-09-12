const User = require('../models/User');

// Get user's cart
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('cart.product');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      cart: user.cart
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cart'
    });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.addToCart(productId, quantity);
    await user.populate('cart.product');

    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      cart: user.cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding to cart'
    });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.removeFromCart(productId);
    await user.populate('cart.product');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      cart: user.cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing from cart'
    });
  }
};

// Update item quantity in cart
const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required'
      });
    }

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity cannot be negative'
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (quantity === 0) {
      await user.removeFromCart(productId);
    } else {
      const existingItem = user.cart.find(item => 
        item.product.toString() === productId.toString()
      );

      if (existingItem) {
        existingItem.quantity = quantity;
        await user.save();
      } else {
        await user.addToCart(productId, quantity);
      }
    }

    await user.populate('cart.product');

    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      cart: user.cart
    });
  } catch (error) {
    console.error('Update cart quantity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating cart'
    });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.clearCart();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart: []
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while clearing cart'
    });
  }
};

// Sync localStorage cart with database cart (for when user logs in)
const syncCart = async (req, res) => {
  try {
    const { localCart } = req.body;

    if (!Array.isArray(localCart)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid cart data'
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Merge localStorage cart with database cart
    for (const item of localCart) {
      const productId = item._id || item.id;
      if (productId) {
        await user.addToCart(productId, item.quantity || 1);
      }
    }

    await user.populate('cart.product');

    res.status(200).json({
      success: true,
      message: 'Cart synced successfully',
      cart: user.cart
    });
  } catch (error) {
    console.error('Sync cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while syncing cart'
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  syncCart
};