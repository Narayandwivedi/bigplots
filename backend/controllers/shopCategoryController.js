const mongoose = require('mongoose');
const ShopCategory = require('../models/ShopCategory');

const toNumberOrDefault = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeCategoryPayload = (payload = {}) => {
  const normalized = {};

  if (payload.name !== undefined) {
    normalized.name = String(payload.name).trim();
  }

  if (payload.imageUrl !== undefined) {
    normalized.imageUrl = String(payload.imageUrl).trim();
  }

  if (payload.redirectUrl !== undefined) {
    normalized.redirectUrl = String(payload.redirectUrl).trim();
  }

  if (payload.priority !== undefined) {
    normalized.priority = toNumberOrDefault(payload.priority, 1);
  }

  if (payload.isActive !== undefined) {
    normalized.isActive = Boolean(payload.isActive);
  }

  return normalized;
};

const getPublicShopCategories = async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(100, toNumberOrDefault(req.query.limit, 30)));

    const categories = await ShopCategory.find({ isActive: true })
      .sort({ priority: 1, createdAt: 1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAllShopCategories = async (req, res) => {
  try {
    const categories = await ShopCategory.find().sort({ priority: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createShopCategory = async (req, res) => {
  try {
    const payload = normalizeCategoryPayload(req.body);

    if (!payload.name) {
      return res.status(400).json({
        success: false,
        message: 'name is required'
      });
    }

    if (!payload.imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'imageUrl is required'
      });
    }

    const category = await ShopCategory.create(payload);

    res.status(201).json({
      success: true,
      message: 'Shop category created successfully',
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const updateShopCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category id'
      });
    }

    const payload = normalizeCategoryPayload(req.body);

    const category = await ShopCategory.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Shop category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Shop category updated successfully',
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const deleteShopCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category id'
      });
    }

    const category = await ShopCategory.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Shop category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Shop category deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const reorderShopCategories = async (req, res) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'orderedIds must be a non-empty array'
      });
    }

    const validIds = orderedIds
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => String(id));

    if (validIds.length !== orderedIds.length) {
      return res.status(400).json({
        success: false,
        message: 'orderedIds contains invalid id values'
      });
    }

    const uniqueIds = [...new Set(validIds)];
    if (uniqueIds.length !== validIds.length) {
      return res.status(400).json({
        success: false,
        message: 'orderedIds contains duplicate ids'
      });
    }

    const categories = await ShopCategory.find({ _id: { $in: uniqueIds } }).select('_id');
    if (categories.length !== uniqueIds.length) {
      return res.status(404).json({
        success: false,
        message: 'One or more categories were not found'
      });
    }

    const operations = uniqueIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { priority: index + 1 }
      }
    }));

    await ShopCategory.bulkWrite(operations);

    const updatedCategories = await ShopCategory.find().sort({ priority: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      message: 'Shop category priority order updated successfully',
      data: updatedCategories
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getPublicShopCategories,
  getAllShopCategories,
  createShopCategory,
  updateShopCategory,
  deleteShopCategory,
  reorderShopCategories
};
