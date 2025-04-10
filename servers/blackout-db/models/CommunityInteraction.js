const mongoose = require('mongoose');

const communityInteractionSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId },
  Likes: Number,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

module.exports = mongoose.model('CommunityInteraction', communityInteractionSchema);