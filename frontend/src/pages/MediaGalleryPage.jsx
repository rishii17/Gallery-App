import React, { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { saveAs } from 'file-saver';
import Spinner from '../components/ui/Spinner';

// Import the new, smaller components
import GalleryActions from '../components/media/GalleryActions';
import MediaGrid from '../components/media/MediaGrid';
import UploadModal from '../components/media/UploadModal';
import ViewerModal from '../components/media/ViewerModal';

const MediaGalleryPage = () => {
    const [media, setMedia] = useState([]);
    const [filteredMedia, setFilteredMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMedia, setSelectedMedia] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // State for modals
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [currentMedia, setCurrentMedia] = useState(null);

    // --- Data Fetching and Filtering ---
    const fetchMedia = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/media');
            setMedia(data);
            setFilteredMedia(data);
        } catch (error) {
            toast.error('Failed to fetch media');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    useEffect(() => {
        const result = media.filter(item => 
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredMedia(result);
    }, [searchTerm, media]);

    // --- Event Handlers ---
    const handleSelect = (id) => {
        setSelectedMedia(prev => 
            prev.includes(id) ? prev.filter(mediaId => mediaId !== id) : [...prev, id]
        );
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this media?')) {
            try {
                await api.delete(`/media/${id}`);
                toast.success('Media deleted successfully');
                fetchMedia(); // Refresh the gallery
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete media');
            }
        }
    };

    const handleDownloadZip = async () => {
        if (selectedMedia.length === 0) {
            toast.error('Please select at least one image to download.');
            return;
        }
        const toastId = toast.loading('Preparing your download...');
        try {
            const response = await api.post('/media/download-zip', { mediaIds: selectedMedia }, { responseType: 'blob' });
            saveAs(response.data, 'media-gallery.zip');
            toast.success('Download started!', { id: toastId });
            setSelectedMedia([]);
        } catch (error) {
            toast.error('Failed to create ZIP file.', { id: toastId });
        }
    };

    const openViewer = (mediaItem) => {
        setCurrentMedia(mediaItem);
        setIsViewerOpen(true);
    };

    if (loading) return <div className="flex justify-center items-center h-full"><Spinner /></div>;

    return (
        <div>
            <GalleryActions 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedMediaCount={selectedMedia.length}
                onDownload={handleDownloadZip}
                onUpload={() => setIsUploadOpen(true)}
            />

            <MediaGrid 
                media={filteredMedia}
                selectedMedia={selectedMedia}
                onSelect={handleSelect}
                onExpand={openViewer}
                onDelete={handleDelete}
            />

            <ViewerModal 
                isOpen={isViewerOpen}
                onClose={() => setIsViewerOpen(false)}
                media={currentMedia}
            />
            
            <UploadModal 
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onUploadSuccess={fetchMedia}
            />
        </div>
    );
};

export default MediaGalleryPage;
