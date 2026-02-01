import express from 'express';
import { postMessage, getConversations, getContext, getAudio, getModel } from '../controllers/conversationController.js';

const router = express.Router();

router.post('/conversations', postMessage);
router.get('/conversations', getConversations);
// retrieval / training-friendly context
router.get('/conversations/context', getContext);
// serve audio blobs
router.get('/conversations/audio/:id', getAudio);
// diagnostics: which persistence backend is active
router.get('/conversations/model', getModel);

export default router;
