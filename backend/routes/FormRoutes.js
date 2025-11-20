import express from 'express';
import { submitForm, getResponses } from '../controllers/formController.js';

const router = express.Router();

router.post('/form-submit', submitForm);
router.get('/form-responses', getResponses);

export default router;
