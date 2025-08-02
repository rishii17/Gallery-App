import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import Spinner from '../components/ui/Spinner';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const [stage, setStage] = useState('email'); // Stages: 'email', 'otp'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: User submits their email to get an OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      toast.success(data.message);
      setUserId(data.userId);
      setStage('otp'); // Move to the next stage
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: User submits the OTP and their new password
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', {
        userId,
        otp,
        newPassword,
      });
      toast.success(data.message);
      navigate('/login'); // On success, redirect to login page
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center">Reset Your Password</h1>

        {/* Stage 1: Email Form */}
        {stage === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <p className="text-center text-sm text-gray-600">
              Enter your account's email address and we will send you a password
              reset code.
            </p>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border rounded-md"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md flex justify-center items-center h-10"
            >
              {loading ? <Spinner /> : 'Send Code'}
            </button>
          </form>
        )}

        {/* Stage 2: OTP and New Password Form */}
        {stage === 'otp' && (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <p className="text-center text-sm text-gray-600">
              A code has been sent to <strong>{email}</strong>. Enter it below
              along with your new password.
            </p>
            <div>
              <label className="block text-sm font-medium">
                Verification Code (OTP)
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength="6"
                className="w-full px-3 py-2 mt-1 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border rounded-md"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md flex justify-center items-center h-10"
            >
              {loading ? <Spinner /> : 'Reset Password'}
            </button>
          </form>
        )}

        <p className="text-sm text-center">
          Remembered your password?{' '}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;