const BlackoutDocument = require('../models/BlackoutDocument');

// Get all documents
const getDocuments = async (req, res) => {
  try {
    const docs = await BlackoutDocument.find().populate('collaborators');
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single document
const getDocumentById = async (req, res) => {
  try {
    const doc = await BlackoutDocument.findById(req.params.id).populate('collaborators');
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a document
const createDocument = async (req, res) => {
  try {
    const newDoc = new BlackoutDocument(req.body);
    const saved = await newDoc.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a document
const updateDocument = async (req, res) => {
  try {
    const updated = await BlackoutDocument.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Document not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a document
const deleteDocument = async (req, res) => {
  try {
    const deleted = await BlackoutDocument.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Document not found' });
    res.json({ message: 'Document deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addBlackoutWord = async (req, res) => {
  const { index, length = 1, createdBy } = req.body;
  const documentId = req.params.id;

  try {
    const updated = await BlackoutDocument.findByIdAndUpdate(
      documentId,
      {
        $push: {
          blackoutWords: {
            index,
            length,
            createdBy
          }
        },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const removeBlackoutWord = async (req, res) => {
  const { index } = req.body;
  const documentId = req.params.id;

  try {
    const updated = await BlackoutDocument.findByIdAndUpdate(
      documentId,
      {
        $pull: { blackoutWords: { index } },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get a random document
const getRandomDocument = async (req, res) => {
  try {
    const randomDoc = await BlackoutDocument.aggregate([
      { $match: { state: 'public' } }, 
      { $sample: { size: 1 } }
    ]);
    if (!randomDoc.length) {
      return res.status(404).json({ message: 'No documents found' });
    }
    res.json(randomDoc[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  addBlackoutWord,
  removeBlackoutWord,
  getRandomDocument
};