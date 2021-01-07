const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/profile', userController.profile);
router.get('/:id', userController.findById);
router.post('/findUsername', userController.findByUsername);

module.exports = router;
