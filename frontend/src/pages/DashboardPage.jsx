import React from 'react';
import useAuthStore from '../store/authStore';
import { Link } from 'react-router-dom';
import { FaImages, FaEnvelope, FaUser } from 'react-icons/fa';

const DashboardPage = () => {
    const user = useAuthStore((state) => state.user);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <p className="text-xl mb-8">Welcome back, {user?.name}!</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Media Gallery Card */}
                <Link to="/gallery" className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <FaImages className="text-4xl text-blue-500 mb-3" />
                    <h2 className="text-xl font-bold">Media Gallery</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">View, upload, and manage your images.</p>
                </Link>

                {/* Contact Card */}
                <Link to="/contact" className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <FaEnvelope className="text-4xl text-green-500 mb-3" />
                    <h2 className="text-xl font-bold">Contact & Messages</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">Send messages to support and view your history.</p>
                </Link>

                {/* Profile Card */}
                <Link to="/profile" className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <FaUser className="text-4xl text-purple-500 mb-3" />
                    <h2 className="text-xl font-bold">Your Profile</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">View your account details.</p>
                </Link>
            </div>
        </div>
    );
};

export default DashboardPage;