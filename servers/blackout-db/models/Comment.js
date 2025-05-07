const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  communityInteractionId: { type: mongoose.Schema.Types.ObjectId, ref: 'CommunityInteraction', required: true },
  comment: { type: String, required: true },
  isEdited: { type: Boolean, default: false },
  editHistory: [{
    content: String,
    editedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true // This will add createdAt and updatedAt fields automatically
});

// Add index for faster queries
commentSchema.index({ userId: 1, createdAt: -1 });
commentSchema.index({ communityInteractionId: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', commentSchema);