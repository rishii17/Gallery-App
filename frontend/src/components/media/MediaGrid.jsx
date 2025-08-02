import React from 'react';
import MediaCard from './MediaCard';

const MediaGrid = ({ media, selectedMedia, onSelect, onExpand, onDelete }) => {
    if (media.length === 0) {
        return <p className="text-center text-gray-500 mt-10">No media found.</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {media.map(item => (
                <MediaCard 
                    key={item._id} 
                    media={item}
                    onSelect={onSelect}
                    isSelected={selectedMedia.includes(item._id)}
                    onExpand={onExpand}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default MediaGrid;