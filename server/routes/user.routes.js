const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword } = require('../controllers/user.controller');
const { addReview } = require('../controllers/review.controller');
const { auth } = require('../middleware/auth');

router.use(auth);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/profile/password', changePassword);
router.post('/reviews', addReview);

module.exports = router;
