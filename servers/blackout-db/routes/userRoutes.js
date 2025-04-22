const express = require('express');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const router = express.Router();

router.get('/', getUsers);             // GET all users
router.get('/:id', getUserById);       // GET one user
router.post('/', createUser);          // CREATE a new user
router.put('/:id', updateUser);        // UPDATE a user
router.delete('/:id', deleteUser);     // DELETE a user

module.exports = router;