const mongoose = require('mongoose');

const shopCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true
    },
    redirectUrl: {
      type: String,
      trim: true,
      default: ''
    },
    priority: {
      type: Number,
      default: 1,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

shopCategorySchema.index({ isActive: 1, priority: 1, createdAt: 1 });

module.exports = mongoose.model('ShopCategory', shopCategorySchema);
