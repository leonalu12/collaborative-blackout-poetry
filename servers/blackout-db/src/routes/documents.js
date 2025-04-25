const express = require('express');
const router = express.Router();
const BlackoutDocument = require('../../models/BlackoutDocument');

router.get('/', async (req, res) => {
  try {
    const docs = await BlackoutDocument.find({ state: 'public' });
    if (!docs.length) {
      return res.status(404).json({ message: 'No public documents found' });
    }
    const randomDoc = docs[Math.floor(Math.random() * docs.length)];
    res.set('Cache-Control', 'no-store'); 
    res.json(randomDoc);
  } catch (err) {
    console.error('[Error fetching random document]', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
