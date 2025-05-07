const Like = require('../models/Like');
const CommunityInteraction = require('../models/CommunityInteraction');

// Like a poem/community interaction
const like = async (req, res) => {
  try {
    const { communityInteractionId } = req.body;
    const userId = req.user._id;
    // Prevent duplicate likes
    const existing = await Like.findOne({ userId, communityInteractionId });
    if (existing) return res.status(400).json({ message: 'Already liked' });
    const newLike = new Like({ userId, communityInteractionId });
    await newLike.save();
    // Optionally add to CommunityInteraction.likes array
    await CommunityInteraction.findByIdAndUpdate(
      communityInteractionId,
      { $push: { likes: newLike._id } }
    );
    res.status(201).json(newLike);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Unlike a poem/community interaction
const unlike = async (req, res) => {
  try {
    const { communityInteractionId } = req.body;
    const userId = req.user._id;
    const like = await Like.findOneAndDelete({ userId, communityInteractionId });
    if (!like) return res.status(404).json({ message: 'Like not found' });
    // Optionally remove from CommunityInteraction.likes array
    await CommunityInteraction.findByIdAndUpdate(
      communityInteractionId,
      { $pull: { likes: like._id } }
    );
    res.json({ message: 'Unliked' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get like count and if current user liked
const getLikeStatus = async (req, res) => {
  try {
    const { communityInteractionId } = req.params;
    const userId = req.user._id;
    const count = await Like.countDocuments({ communityInteractionId });
    const liked = await Like.exists({ communityInteractionId, userId });
    res.json({ count, likedByCurrentUser: !!liked });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { like, unlike, getLikeStatus }; 