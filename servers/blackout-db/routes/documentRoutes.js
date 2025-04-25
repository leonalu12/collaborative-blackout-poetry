const express = require('express');
const {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument
} = require('../controllers/documentController');




const router = express.Router();


router.get('/', getDocuments);

router.post('/', createDocument);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);

router.get('/:id', getDocumentById);



module.exports = router;