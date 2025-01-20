//my-clinic-backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  createUpdateUser
} = require('../controllers/userController');

router.get('/profile/:phone', getUserProfile);
router.post('/profile', createUpdateUser);

module.exports = router;