import User from '../models/User.js';
import Contact from '../models/Contact.js';

// --- USER MANAGEMENT ---

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) { next(error); }
};

/**
 * @desc    Update a user's profile (Admin)
 * @route   PUT /api/admin/users/:id
 * @access  Admin
 */
export const updateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update fields from request body if they exist
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        
        // Note: In a real-world scenario, you might want to handle user's associated media here.
        await User.deleteOne({ _id: req.params.id });
        res.json({ message: 'User removed successfully.' });
    } catch (error) { next(error); }
};


// --- MESSAGE MANAGEMENT ---

export const getAllMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) { next(error); }
};

/**
 * @desc    Delete all contact messages (Admin)
 * @route   DELETE /api/admin/messages
 * @access  Admin
 */
export const deleteAllMessages = async (req, res, next) => {
    try {
        await Contact.deleteMany({});
        res.json({ message: 'All contact messages have been deleted.' });
    } catch (error) {
        next(error);
    }
};