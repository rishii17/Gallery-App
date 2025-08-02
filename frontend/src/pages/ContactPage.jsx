import React, { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import Spinner from '../components/ui/Spinner';
import { formatDistanceToNow } from 'date-fns';
import { FaTrash } from 'react-icons/fa';

const ContactPage = () => {
    const user = useAuthStore((state) => state.user);
    const [message, setMessage] = useState('');
    const [myMessages, setMyMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(true);

    const fetchMyMessages = async () => {
        setLoadingMessages(true);
        try {
            const { data } = await api.get('/contact/mymessages');
            setMyMessages(data);
        } catch (error) {
            toast.error("Failed to load your messages.");
        } finally {
            setLoadingMessages(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchMyMessages();
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // The backend will get name and email from the authenticated user
            await api.post('/contact', { message, name: user.name, email: user.email });
            toast.success('Message sent successfully!');
            setMessage('');
            fetchMyMessages(); // Refresh the list
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send message.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            try {
                await api.delete(`/contact/${id}`);
                toast.success("Message deleted.");
                fetchMyMessages(); // Refresh the list
            } catch (error) {
                 toast.error("Failed to delete message.");
            }
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-6">Contact Support</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium">Name</label>
                        <input type="text" id="name" value={user?.name || ''} required disabled className="mt-1 block w-full rounded-md bg-gray-200 dark:bg-gray-700" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">Email</label>
                        <input type="email" id="email" value={user?.email || ''} required disabled className="mt-1 block w-full rounded-md bg-gray-200 dark:bg-gray-700" />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium">Message</label>
                        <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} required rows="5" className="mt-1 block w-full rounded-md"></textarea>
                    </div>
                    <button type="submit" disabled={loading} className="w-full px-4 py-3 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 flex justify-center items-center">
                        {loading ? <Spinner /> : 'Send Message'}
                    </button>
                </form>
            </div>

            {/* My Messages History */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold mb-6">Your Message History</h2>
                {loadingMessages ? <Spinner /> : (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {myMessages.length > 0 ? myMessages.map(msg => (
                            <div key={msg._id} className="border-l-4 border-blue-500 p-4 bg-gray-50 dark:bg-gray-700 rounded-r-lg">
                                <p className="mb-2">{msg.message}</p>
                                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                                    <span>{formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}</span>
                                    <button onClick={() => handleDelete(msg._id)} className="hover:text-red-500"><FaTrash/></button>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-gray-500">You haven't sent any messages yet.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactPage;