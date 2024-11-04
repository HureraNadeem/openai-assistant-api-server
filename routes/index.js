const express = require('express');

const router = express.Router();

const controllers = require('../controllers');

router.post('/', controllers.createAssistant);
router.post('/threads', controllers.createThread);
router.post('/threads/:threadId/converse', controllers.converse);
router.get('/threads/:threadId', controllers.getThreadConversation);

module.exports = router;
