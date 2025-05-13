const CommunityInteraction = require('../models/CommunityInteraction');

const getInteractions = async (req, res) => {
  try {
    const interactions = await CommunityInteraction.find().populate('comments');
    res.json(interactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getInteractionById = async (req, res) => {
  try {
    const interaction = await CommunityInteraction.findById(req.params.id).populate('comments');
    if (!interaction) return res.status(404).json({ message: 'Interaction not found' });
    res.json(interaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createInteraction = async (req, res) => {
  try {
    const newInteraction = new CommunityInteraction(req.body);
    const saved = await newInteraction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateInteraction = async (req, res) => {
  try {
    const updated = await CommunityInteraction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Interaction not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteInteraction = async (req, res) => {
  try {
    const deleted = await CommunityInteraction.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Interaction not found' });
    res.json({ message: 'Interaction deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Increment the like count for a document
const likeInteraction = async (req, res) => {
  try {
    const { id } = req.params;           // documentId
    const { userId } = req.body;

    let ci = await CommunityInteraction.findOne({ documentId: id });
    if (!ci) {
      ci = new CommunityInteraction({ documentId: id, Likes: 0, comments: [] });
    }
    ci.Likes = (ci.Likes || 0) + 1;
    await ci.save();

    res.status(200).json({ Likes: ci.Likes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new comment
const addComment = async (req, res) => {
  try {
    const { id } = req.params;        // documentId
    const { userId, comment } = req.body;

    let ci = await CommunityInteraction.findOne({ documentId: id });
    if (!ci) {
      ci = new CommunityInteraction({ documentId: id, Likes: 0, comments: [] });
    }
    const newComment = await Comment.create({ userId, text: comment });
    ci.comments.push(newComment._id);
    await ci.save();

    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getInteractions,
  getInteractionById,
  createInteraction,
  updateInteraction,
  deleteInteraction,
  likeInteraction,
  addComment
};