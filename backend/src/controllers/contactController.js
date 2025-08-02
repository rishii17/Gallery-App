import Contact from '../models/Contact.js';

export const submitMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ message: 'All fields are required.' });

    const newContactMessage = new Contact({ name, email, message, userId: req.user ? req.user._id : null });
    await newContactMessage.save();
    res.status(201).json(newContactMessage);
  } catch (error) { next(error); }
};

export const getMyMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) { next(error); }
};

export const deleteMyMessage = async (req, res, next) => {
  try {
    const contactMessage = await Contact.findById(req.params.id);
    if (!contactMessage) return res.status(404).json({ message: 'Message not found.' });
    if (contactMessage.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized.' });
    }
    await Contact.deleteOne({ _id: req.params.id });
    res.json({ message: 'Message removed.' });
  } catch (error) { next(error); }
};
