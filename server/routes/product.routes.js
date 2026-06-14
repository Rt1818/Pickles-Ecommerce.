const express = require('express');
const router = express.Router();
const { getProducts, getProductBySlug, getCategories } = require('../controllers/product.controller');
const { getProductReviews } = require('../controllers/review.controller');

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:slug', getProductBySlug);
router.get('/:id/reviews', getProductReviews);

module.exports = router;
