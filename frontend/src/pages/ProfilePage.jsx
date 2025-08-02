import React from 'react';
import useAuthStore from '../store/authStore';
import { FaUser, FaEnvelope, FaShieldAlt } from 'react-icons/fa';

const ProfilePage = () => {
    const user = useAuthStore((state) => state.user);

    return (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Your Profile</h1>
            <div className="space-y-4">
                <div className="flex items-center">
                    <FaUser className="text-xl text-gray-500 mr-4"/>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                        <p className="font-semibold">{user?.name}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <FaEnvelope className="text-xl text-gray-500 mr-4"/>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="font-semibold">{user?.email}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <FaShieldAlt className="text-xl text-gray-500 mr-4"/>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                        <p className="font-semibold capitalize">{user?.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;