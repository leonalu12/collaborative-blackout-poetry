const express = require('express');
const router = express.Router();
const { like, unlike, getLikeStatus } = require('../controllers/likeController');
const { auth } = require('../middleware/auth');

// Like a poem/community interaction
router.post('/', auth, like);
// Unlike a poem/community interaction
router.delete('/', auth, unlike);
// Get like count and if current user liked
router.get('/community/:communityInteractionId', auth, getLikeStatus);

module.exports = router; 