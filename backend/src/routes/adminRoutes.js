import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import { 
    getAllUsers, 
    updateUser, // <-- Import new function
    deleteUser, 
    getAllMessages,
    deleteAllMessages // <-- Import new function
} from '../controllers/adminController.js';

const router = express.Router();

// All routes in this file are protected and require admin access
router.use(protect, admin);

// --- User management routes ---
router.route('/users')
    .get(getAllUsers);

router.route('/users/:id')
    .put(updateUser) // <-- Add PUT route for updating
    .delete(deleteUser);

// --- Contact message management routes ---
router.route('/messages')
    .get(getAllMessages)
    .delete(deleteAllMessages); // <-- Add DELETE route for all messages

export default router;