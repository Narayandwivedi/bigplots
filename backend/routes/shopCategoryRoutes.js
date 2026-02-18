const express = require('express');
const router = express.Router();
const {
  getPublicShopCategories,
  getAllShopCategories,
  createShopCategory,
  updateShopCategory,
  deleteShopCategory,
  reorderShopCategories
} = require('../controllers/shopCategoryController');

router.get('/', getPublicShopCategories);
router.get('/admin', getAllShopCategories);
router.post('/', createShopCategory);
router.patch('/reorder', reorderShopCategories);
router.put('/:id', updateShopCategory);
router.delete('/:id', deleteShopCategory);

module.exports = router;
