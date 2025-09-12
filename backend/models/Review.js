const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // Product Reference
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required'],
    index: true
  },
  
  // Order Reference (ensures verified purchase)
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order ID is required']
  },
  
  // User Reference (optional for guest orders)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true  // Allow null for guest reviews
  },
  
  // Reviewer Information (from order for verification)
  reviewerInfo: {
    name: {
      type: String,
      required: [true, 'Reviewer name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Reviewer email is required'],
      lowercase: true,
      trim: true
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: true
    }
  },
  
  // Review Content
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    validate: {
      validator: function(v) {
        return Number.isInteger(v) || (v % 0.5 === 0);
      },
      message: 'Rating must be a whole number or half number (1, 1.5, 2, 2.5, etc.)'
    }
  },
  
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    minlength: [10, 'Comment must be at least 10 characters'],
    maxlength: [2000, 'Comment cannot exceed 2000 characters']
  },
  
  // Review Images (optional)
  images: [{
    type: String,  // Image URLs
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Invalid image URL format'
    }
  }],
  
  // Helpful Votes
  helpfulVotes: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Users who found this review helpful
  helpfulBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Review Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'flagged'],
    default: 'pending',
    index: true
  },
  
  // Admin moderation
  moderationNotes: {
    type: String,
    maxlength: [500, 'Moderation notes cannot exceed 500 characters']
  },
  
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'  // Admin user
  },
  
  moderatedAt: {
    type: Date
  },
  
  // Product snapshot (for historical accuracy)
  productSnapshot: {
    name: String,
    brand: String,
    model: String,
    category: String,
    subCategory: String,
    price: Number
  },
  
  // Review Metadata
  isEdited: {
    type: Boolean,
    default: false
  },
  
  editHistory: [{
    editedAt: { type: Date, default: Date.now },
    previousRating: Number,
    previousTitle: String,
    previousComment: String,
    reason: String
  }],
  
  // Spam/Quality Flags
  qualityScore: {
    type: Number,
    default: 0,
    min: -100,
    max: 100
  },
  
  isSpam: {
    type: Boolean,
    default: false
  },
  
  // Response from seller/admin
  response: {
    comment: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: Date,
    isOfficial: { type: Boolean, default: false }
  }
  
}, {
  timestamps: true
});

// Compound Indexes for Performance
reviewSchema.index({ productId: 1, status: 1 });
reviewSchema.index({ productId: 1, rating: -1 });
reviewSchema.index({ orderId: 1, productId: 1 }, { unique: true }); // One review per product per order
reviewSchema.index({ userId: 1, createdAt: -1 });
reviewSchema.index({ status: 1, createdAt: -1 });

// Pre-save hook to populate product snapshot
reviewSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('productId')) {
    try {
      const Product = mongoose.model('Product');
      const product = await Product.findById(this.productId).select('seoTitle brand model category subCategory price');
      
      if (product) {
        this.productSnapshot = {
          name: product.seoTitle,
          brand: product.brand,
          model: product.model,
          category: product.category,
          subCategory: product.subCategory,
          price: product.price
        };
      }
    } catch (error) {
      console.error('Error populating product snapshot:', error);
    }
  }
  
  // Auto-approve reviews from verified purchases with good quality scores
  if (this.isNew && this.reviewerInfo.isVerifiedPurchase && this.qualityScore >= 0) {
    this.status = 'approved';
  }
  
  next();
});

// Virtual for average rating calculation helper
reviewSchema.virtual('isPositive').get(function() {
  return this.rating >= 4;
});

// Static method to get product review summary
reviewSchema.statics.getProductSummary = async function(productId) {
  const result = await this.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId), status: 'approved' } },
    {
      $group: {
        _id: '$productId',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    },
    {
      $addFields: {
        averageRating: { $round: ['$averageRating', 1] },
        ratingBreakdown: {
          5: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 5] } } } },
          4: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 4] } } } },
          3: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 3] } } } },
          2: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 2] } } } },
          1: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 1] } } } }
        }
      }
    },
    {
      $project: {
        ratingDistribution: 0
      }
    }
  ]);
  
  return result[0] || { averageRating: 0, totalReviews: 0, ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
};

// Instance method to mark review as helpful
reviewSchema.methods.markHelpful = function(userId) {
  if (!this.helpfulBy.includes(userId)) {
    this.helpfulBy.push(userId);
    this.helpfulVotes += 1;
    return this.save();
  }
  return Promise.resolve(this);
};

module.exports = mongoose.model('Review', reviewSchema);