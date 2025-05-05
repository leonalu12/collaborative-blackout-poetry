const mongoose = require('mongoose');

const blackoutDocumentSchema = new mongoose.Schema({
  documentName: String,
  content: String,
  blackoutWords: [
    {
      index: Number, // index of blacked-out word in original content
      length: Number, // optional: how many words, default 1
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  state: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('BlackoutDocument', blackoutDocumentSchema);