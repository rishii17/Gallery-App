import React from 'react';
import { FaSearch, FaDownload, FaUpload } from 'react-icons/fa';

const GalleryActions = ({ searchTerm, setSearchTerm, selectedMediaCount, onDownload, onUpload }) => {
    return (
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h1 className="text-3xl font-bold">Media Gallery</h1>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    />
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                {selectedMediaCount > 0 && (
                    <button onClick={onDownload} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700">
                        <FaDownload /> Download ({selectedMediaCount})
                    </button>
                )}
                 <button onClick={onUpload} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
                    <FaUpload /> Upload
                </button>
            </div>
        </div>
    );
};

export default GalleryActions;