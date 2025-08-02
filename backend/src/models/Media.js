import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  tags: [String],
  fileUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  fileType: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isShared: { type: Boolean, default: false },
}, { timestamps: true });

const Media = mongoose.model('Media', mediaSchema);
export default Media;
