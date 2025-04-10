const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  communityInteractionId: { type: mongoose.Schema.Types.ObjectId, ref: 'CommunityInteraction' },
  comment: String,
});

module.exports = mongoose.model('Comment', commentSchema);