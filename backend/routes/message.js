const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message')

router.get('/recents', messageController.recents);
router.get('/conversationsWith/:user_id', messageController.conversationWithUser);
router.post('/send', messageController.send);
router.put('/retract', messageController.retract);
router.delete('/', messageController.delete);

module.exports = router;
