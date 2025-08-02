import React from 'react';
import { FaTrash, FaExpand, FaCheckSquare, FaSquare } from 'react-icons/fa';

const MediaCard = ({ media, onSelect, isSelected, onExpand, onDelete }) => {
    return (
      <div className="relative group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <img src={media.fileUrl} alt={media.title} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
          <div>
            <h3 className="text-white text-lg font-bold truncate">{media.title}</h3>
          </div>
          <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                  <button onClick={() => onExpand(media)} className="text-white hover:text-blue-400" title="Expand"><FaExpand size={18}/></button>
                  <button onClick={() => onDelete(media._id)} className="text-white hover:text-red-400" title="Delete"><FaTrash size={18}/></button>
              </div>
              <button onClick={() => onSelect(media._id)} className="text-white" title="Select">
                  {isSelected ? <FaCheckSquare size={22} className="text-blue-400"/> : <FaSquare size={22} />}
              </button>
          </div>
        </div>
      </div>
    );
};

export default MediaCard;