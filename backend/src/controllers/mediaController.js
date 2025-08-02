import Media from '../models/Media.js';
import { streamUpload, cloudinary } from '../lib/cloudinary.js';
import archiver from 'archiver';
import axios from 'axios';

export const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please upload a file.' });

    const { title, description, tags, isShared } = req.body;
    const result = await streamUpload(req.file.buffer, "media-gallery");
    const newMedia = new Media({
      title, description,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      fileUrl: result.secure_url,
      publicId: result.public_id,
      fileType: req.file.mimetype,
      user: req.user._id,
      isShared: isShared === 'true',
    });
    await newMedia.save();
    res.status(201).json(newMedia);
  } catch (error) { next(error);
    console.log("error in upload ")
   }
};

export const getMedia = async (req, res, next) => {
    try {
        const { search, tags } = req.query;
        const query = { $or: [{ user: req.user._id }, { isShared: true }] };
        if (search) query.title = { $regex: search, $options: 'i' };
        if (tags) query.tags = { $in: tags.split(',') };
        
        const media = await Media.find(query).populate('user', 'name').sort({ createdAt: -1 });
        res.json(media);
    } catch (error) { next(error); }
};

export const deleteMedia = async (req, res, next) => {
    try {
        const media = await Media.findById(req.params.id);
        if (!media) return res.status(404).json({ message: 'Media not found.' });

        if (media.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized.' });
        }
        
        await cloudinary.uploader.destroy(media.publicId);
        await Media.deleteOne({ _id: req.params.id });
        res.json({ message: 'Media removed successfully.' });
    } catch (error) { next(error); }
};

export const downloadZip = async (req, res, next) => {
    try {
        const { mediaIds } = req.body;
        const mediaItems = await Media.find({ '_id': { $in: mediaIds } });
        if (!mediaItems.length) return res.status(404).json({ message: 'No media found.' });

        const archive = archiver('zip');
        res.attachment('media-gallery.zip');
        archive.pipe(res);

        for (const item of mediaItems) {
            const response = await axios({ url: item.fileUrl, responseType: 'stream' });
            const fileName = `${item.title.replace(/[^a-z0-9]/gi, '_')}.${item.fileUrl.split('.').pop()}`;
            archive.append(response.data, { name: fileName });
        }
        await archive.finalize();
    } catch (error) { next(error); }
};
