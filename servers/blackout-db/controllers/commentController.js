const Comment = require('../models/Comment');
const CommunityInteraction = require('../models/CommunityInteraction');

// Create a new comment
const createComment = async (req, res) => {
  try {
    const { communityInteractionId, comment } = req.body;
    const userId = req.user._id; // From auth middleware

    // Create the comment
    const newComment = new Comment({
      userId,
      communityInteractionId,
      comment
    });

    await newComment.save();

    // Add comment to CommunityInteraction
    await CommunityInteraction.findByIdAndUpdate(
      communityInteractionId,
      { $push: { comments: newComment._id } }
    );

    // Populate user info before sending response
    await newComment.populate('userId', 'username');

    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get comments for a specific community interaction
const getComments = async (req, res) => {
  try {
    const { communityInteractionId } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const comments = await Comment.find({ communityInteractionId })
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'username')
      .lean();

    const count = await Comment.countDocuments({ communityInteractionId });

    res.json({
      comments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalComments: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get comments by a specific user
const getUserComments = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const comments = await Comment.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('communityInteractionId')
      .lean();

    const count = await Comment.countDocuments({ userId });

    res.json({
      comments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalComments: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.user._id;

    const existingComment = await Comment.findById(id);

    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (existingComment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    // Add current content to edit history
    existingComment.editHistory.push({
      content: existingComment.comment,
      editedAt: new Date()
    });

    // Update comment
    existingComment.comment = comment;
    existingComment.isEdited = true;
    await existingComment.save();

    res.json(existingComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    // Remove comment from CommunityInteraction
    await CommunityInteraction.findByIdAndUpdate(
      comment.communityInteractionId,
      { $pull: { comments: comment._id } }
    );

    await comment.remove();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComment,
  getComments,
  getUserComments,
  updateComment,
  deleteComment
};