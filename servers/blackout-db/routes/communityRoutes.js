const express = require('express');
const {
  getInteractions,
  getInteractionById,
  createInteraction,
  updateInteraction,
  deleteInteraction
} = require('../controllers/communityController');

const router = express.Router();

router.get('/', getInteractions);
router.get('/:id', getInteractionById);
router.post('/', createInteraction);
router.put('/:id', updateInteraction);
router.delete('/:id', deleteInteraction);

module.exports = router;