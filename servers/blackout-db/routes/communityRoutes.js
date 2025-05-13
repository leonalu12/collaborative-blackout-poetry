const express = require('express');
const {
  getInteractions,
  getInteractionById,
  createInteraction,
  updateInteraction,
  deleteInteraction,
  likeInteraction,
  addComment
} = require('../controllers/communityController');

const router = express.Router();

router.get('/', getInteractions);
router.get('/:id', getInteractionById);
router.post('/', createInteraction);
router.put('/:id', updateInteraction);
router.delete('/:id', deleteInteraction);


// Like and comment routes
router.put('/:id/like',     likeInteraction);
router.post('/:id/comments', addComment);

module.exports = router;