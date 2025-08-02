import React, { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import Spinner from '../components/ui/Spinner';
import { formatDistanceToNow } from 'date-fns';
import { FaTrash, FaUser, FaEnvelope, FaUserEdit } from 'react-icons/fa';
import EditUserModal from '../components/admin/EditUserModal'; // <-- Import the new modal

// --- User Management Component ---
const UserManagement = ({ users, fetchUsers }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const openEditModal = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleUpdateUser = async (userId, updatedData) => {
        try {
            await api.put(`/admin/users/${userId}`, updatedData);
            toast.success("User updated successfully!");
            fetchUsers(); // Refresh the user list
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update user.");
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await api.delete(`/admin/users/${userId}`);
                toast.success("User deleted successfully.");
                fetchUsers();
            } catch (error) {
                toast.error("Failed to delete user.");
            }
        }
    };

    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    {/* Table Head */}
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Actions</th>
                        </tr>
                    </thead>
                    {/* Table Body */}
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map(user => (
                            <tr key={user._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap capitalize">{user.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                    <button onClick={() => openEditModal(user)} className="text-indigo-600 hover:text-indigo-900" title="Edit User">
                                        <FaUserEdit size={18}/>
                                    </button>
                                    <button onClick={() => handleDeleteUser(user._id)} className="text-red-600 hover:text-red-900" title="Delete User">
                                        <FaTrash size={18}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Edit User Modal */}
            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={selectedUser}
                onUserUpdate={handleUpdateUser}
            />
        </>
    );
};

// --- Message Management Component ---
const MessageManagement = ({ messages, fetchMessages }) => {
    const handleDeleteAll = async () => {
        if (window.confirm("Are you sure you want to delete ALL contact messages? This action cannot be undone.")) {
            try {
                await api.delete('/admin/messages');
                toast.success("All messages deleted.");
                fetchMessages(); // Refresh the list
            } catch (error) {
                toast.error("Failed to delete messages.");
            }
        }
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                <button 
                    onClick={handleDeleteAll}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 disabled:bg-red-400"
                    disabled={messages.length === 0}
                >
                    <FaTrash /> Delete All Messages
                </button>
            </div>
            <div className="space-y-4">
                {messages.length > 0 ? messages.map(msg => (
                    <div key={msg._id} className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                        <p className="mb-3">{msg.message}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 border-t pt-3 mt-3">
                            <div>
                                {/* If message is from a registered user, show their details from the populated 'userId' field */}
                                {msg.userId ? (
                                    <>
                                        <p className="flex items-center font-semibold"><FaUser className="mr-2"/>{msg.userId.name} (Registered User)</p>
                                        <p className="flex items-center"><FaEnvelope className="mr-2"/>{msg.userId.email}</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="flex items-center font-semibold"><FaUser className="mr-2"/>{msg.name} (Guest)</p>
                                        <p className="flex items-center"><FaEnvelope className="mr-2"/>{msg.email}</p>
                                    </>
                                )}
                            </div>
                            <div className="text-right">
                                <p>{formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}</p>
                            </div>
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-gray-500">No messages found.</p>
                )}
            </div>
        </div>
    );
};

// --- Main Admin Page Component ---
const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data);
        } catch (error) {
            toast.error("Failed to fetch users.");
        }
    };

    const fetchMessages = async () => {
        try {
            const { data } = await api.get('/admin/messages');
            setMessages(data);
        } catch (error) {
            toast.error("Failed to fetch messages.");
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchUsers(), fetchMessages()]);
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-full"><Spinner /></div>;

    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('users')} className={`${activeTab === 'users' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'} py-4 px-1 border-b-2 font-medium text-sm`}>User Management</button>
                    <button onClick={() => setActiveTab('messages')} className={`${activeTab === 'messages' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'} py-4 px-1 border-b-2 font-medium text-sm`}>Contact Messages</button>
                </nav>
            </div>
            <div className="mt-6">
                {activeTab === 'users' && <UserManagement users={users} fetchUsers={fetchUsers} />}
                {activeTab === 'messages' && <MessageManagement messages={messages} fetchMessages={fetchMessages} />}
            </div>
        </div>
    );
};

export default AdminPage;