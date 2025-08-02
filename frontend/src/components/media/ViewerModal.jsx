import React from 'react';
import { format } from 'date-fns';
import Modal from '../ui/Modal';

const ViewerModal = ({ isOpen, onClose, media }) => {
    if (!media) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={media.title}>
            <div>
                <img src={media.fileUrl} alt={media.title} className="w-full max-h-[70vh] object-contain rounded-lg mb-4"/>
                <p className="mb-2">{media.description}</p>
                <div className="text-sm text-gray-500 mb-2">Uploaded on {format(new Date(media.createdAt), 'PP')}</div>
                <div className="flex flex-wrap gap-2">
                    {media.tags.map(tag => (
                        <span key={tag} className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-sm">{tag}</span>
                    ))}
                </div>
            </div>
        </Modal>
    );
};

export default ViewerModal;