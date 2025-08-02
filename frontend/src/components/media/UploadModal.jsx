import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import api from '../../api';
import Modal from '../ui/Modal';
import Spinner from '../ui/Spinner';

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);

    // This effect runs when the 'isOpen' prop changes.
    useEffect(() => {
        // If the modal is closing, reset all the fields.
        if (!isOpen) {
            setFile(null);
            setPreview(null);
            setTitle('');
            setDescription('');
            setTags('');
        }
    }, [isOpen]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            const selectedFile = acceptedFiles[0];
            if (selectedFile) {
                setFile(selectedFile);
                setPreview(URL.createObjectURL(selectedFile));
            }
        },
        accept: { 'image/jpeg': [], 'image/png': [] },
        maxFiles: 1,
    });
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please select a file.");
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('tags', tags);

        try {
            await api.post('/media/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success("Upload successful!");
            onUploadSuccess(); // Callback to refresh the gallery
            onClose(); // Close the modal
        } catch (error) {
            toast.error(error.response?.data?.message || "Upload failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Upload New Media">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${isDragActive ? 'border-blue-500' : 'border-gray-300'}`}>
                    <input {...getInputProps()} />
                    {preview ? <img src={preview} alt="Preview" className="h-32 mx-auto rounded"/> : <p>Drag 'n' drop an image here, or click to select.</p>}
                </div>
                 <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 mt-1 border rounded-md" />
                </div>
                 <div>
                    <label className="block text-sm font-medium">Tags (comma-separated)</label>
                    <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full px-3 py-2 mt-1 border rounded-md" />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded-md flex justify-center">
                    {loading ? <Spinner/> : "Upload"}
                </button>
            </form>
        </Modal>
    );
};

export default UploadModal;