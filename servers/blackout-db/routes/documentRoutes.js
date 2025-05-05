const express = require('express');
const {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  addBlackoutWord,
  removeBlackoutWord,
  getRandomDocument
} = require('../controllers/documentController');




const router = express.Router();

router.get('/random', getRandomDocument);
router.get('/', getDocuments);
router.get('/:id', getDocumentById);
router.post('/', createDocument);
router.post('/:id/blackout', addBlackoutWord);
router.delete('/:id/blackout', removeBlackoutWord);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);







module.exports = router;