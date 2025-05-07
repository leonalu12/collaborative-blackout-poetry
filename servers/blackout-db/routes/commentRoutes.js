const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const {
  createComment,
  getComments,
  getUserComments,
  updateComment,
  deleteComment
} = require('../controllers/commentController');
const { auth } = require('../middleware/auth');

// Validation middleware
const validateComment = [
  body('comment').trim().notEmpty().withMessage('Comment cannot be empty'),
  body('communityInteractionId').isMongoId().withMessage('Invalid community interaction ID')
];

const validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sortBy').optional().isIn(['createdAt']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
];

// Create a new comment (requires authentication)
router.post('/',
  auth,
  validateComment,
  createComment
);

// Get comments for a specific community interaction
router.get('/community/:communityInteractionId',
  auth,
  param('communityInteractionId').isMongoId().withMessage('Invalid community interaction ID'),
  validatePagination,
  getComments
);

// Get comments by a specific user
router.get('/user/:userId',
  auth,
  param('userId').isMongoId().withMessage('Invalid user ID'),
  validatePagination,
  getUserComments
);

// Update a comment (requires authentication)
router.put('/:id',
  auth,
  param('id').isMongoId().withMessage('Invalid comment ID'),
  body('comment').trim().notEmpty().withMessage('Comment cannot be empty'),
  updateComment
);

// Delete a comment (requires authentication)
router.delete('/:id',
  auth,
  param('id').isMongoId().withMessage('Invalid comment ID'),
  deleteComment
);

module.exports = router;