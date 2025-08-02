import User from '../models/User.js';
import generateToken from '../lib/jwt.js';
import { generateOTP, sendOTPEmail } from '../lib/otp.js';

export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    
    const user = new User({ name, email, password });
    await user.save();
    
    res.status(201).json({ message: 'Registration successful. Check your email for OTP.', userId: user._id });
  } catch (error) { next(error); }
};

export const verifyOtp = async (req, res, next) => {
    const { userId, otp } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        res.status(200).json({ message: "Account verified successfully." });
    } catch (error) { next(error); }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    if (!user.isActive) return res.status(403).json({ message: 'Account is deactivated.' });
    
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
  } catch (error) { next(error); }
};

export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found.' });
        
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();
        await sendOTPEmail(email, otp, 'Password Reset Code');
        res.json({ message: 'OTP sent to your email.', userId: user._id });
    } catch (error) { next(error); }
};

export const resetPassword = async (req, res, next) => {
    const { userId, otp, newPassword } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }
        user.password = newPassword;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        res.json({ message: 'Password has been reset successfully.' });
    } catch (error) { next(error); }
};


// Add this function to your existing authController.js

/**
 * @desc    Get user profile data
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getUserProfile = async (req, res, next) => {
  try {
    // The 'protect' middleware has already fetched the user and attached it to the request object (req.user).
    // We just need to send it back.
    const user = await User.findById(req.user._id).select('-password'); // Ensure password is not sent
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};