import express from 'express';
import { protect } from '../middleware/auth.js';
import { submitMessage, getMyMessages, deleteMyMessage } from '../controllers/contactController.js';

const router = express.Router();

// This route is protected, so only logged-in users can submit.
// For a truly public form, you would remove the 'protect' middleware.
router.route('/')
    .post(protect, submitMessage);

router.route('/mymessages')
    .get(protect, getMyMessages);

router.route('/:id')
    .delete(protect, deleteMyMessage);

export default router;
