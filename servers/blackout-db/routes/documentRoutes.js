const express = require('express');
const {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  getRandomDocument
} = require('../controllers/documentController');




const router = express.Router();

router.get('/random', getRandomDocument);
router.get('/', getDocuments);
router.get('/:id', getDocumentById);
router.post('/', createDocument);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);






module.exports = router;