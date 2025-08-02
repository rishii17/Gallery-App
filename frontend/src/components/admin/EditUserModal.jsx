import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Spinner from '../ui/Spinner';

const EditUserModal = ({ isOpen, onClose, user, onUserUpdate }) => {
    const [formData, setFormData] = useState({ name: '', email: '', role: 'user' });
    const [loading, setLoading] = useState(false);

    // When the 'user' prop changes (i.e., when the modal is opened for a user),
    // pre-fill the form with that user's data.
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // The onUserUpdate function is passed from the parent (AdminPage)
            // and will handle the API call.
            await onUserUpdate(user._id, formData);
            onClose(); // Close the modal on success
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Edit User: ${user?.name}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 mt-1 border rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 mt-1 border rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Role</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-3 py-2 mt-1 border rounded-md"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 rounded-md flex justify-center"
                >
                    {loading ? <Spinner /> : "Save Changes"}
                </button>
            </form>
        </Modal>
    );
};

export default EditUserModal;