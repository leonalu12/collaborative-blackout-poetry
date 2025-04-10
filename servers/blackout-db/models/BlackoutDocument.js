const mongoose = require('mongoose');

const blackoutDocumentSchema = new mongoose.Schema({
  documentName: String,
  content: String,
  blackoutContent: String,
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  state: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('BlackoutDocument', blackoutDocumentSchema);