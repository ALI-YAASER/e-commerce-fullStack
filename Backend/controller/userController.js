import userModel from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();

// Improved token generation with better security
const generateToken = (userId, role) => {
    return jwt.sign(
        {
            userId,
            role,
            iss: 'your-app-name',  // Issuer
            aud: 'your-app-client'  // Audience
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '30d',
            algorithm: 'HS256'  // Explicit algorithm specification
        }
    );
};

// Enhanced user registration
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Password strength validation
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters'
            });
        }

        // Check if user exists
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with default 'user' role
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            role: 'user'  // Default role, admin must be assigned manually
        });

        // Generate token
        const token = generateToken(user._id, user.role);

        // Omit sensitive data in response
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            cartData: user.cartData
        };

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: userResponse,
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
};

// Secure user login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'  // Generic message for security
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user._id, user.role);

        // User response without sensitive data
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            cartData: user.cartData
        };

        // Secure cookie options for production
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        };

        res.cookie('token', token, cookieOptions)
            .status(200)
            .json({
                success: true,
                message: 'Login successful',
                user: userResponse,
                token  // Also send in response for mobile clients
            });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await userModel.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Fetch user profile error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const updateUserInformation = async (req, res) => {
    try {
        const userId = req.userId;

        const {
            name,
            email,
            phone,
            gender,
            birthday,
            addressLine1,
            addressLine2,
        } = req.body;

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        if (req.file && user.profileImage) {
            fs.unlink(user.profileImage, err => {
                if (err) console.error("Error deleting old profile image:", err);
            });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.gender = gender || user.gender;
        user.birthday = birthday || user.birthday;
        user.address = {
            line1: addressLine1 || user.address?.line1 || "",
            line2: addressLine2 || user.address?.line2 || "",
        };

        if (req.file) user.profileImage = req.file.path;

        await user.save();

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Update user error:", error); // 👈 أضف هذا
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ Delete profile image only
export const deleteUserProfileImage = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);

        if (!user || !user.profileImage) {
            return res.status(404).json({ success: false, message: "No profile image to delete" });
        }

        fs.unlink(user.profileImage, (err) => {
            if (err) console.error("Error deleting image:", err);
        });

        user.profileImage = "";
        await user.save();

        res.status(200).json({ success: true, message: "Profile image deleted" });
    } catch (error) {
        console.error("Delete image error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Verify against environment variables first
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        // 2. Find existing user (if any)
        let user = await userModel.findOne({ email });

        // 3. Case 1: No user exists → Create new admin
        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = await userModel.create({
                name: "Admin",
                email,
                password: hashedPassword,
                role: "admin"
            });
        }
        // 4. Case 2: User exists but isn't admin → Upgrade to admin
        else if (user.role !== "admin") {
            user.role = "admin";
            user.password = await bcrypt.hash(password, 10); // Update password
            await user.save();
        }

        // 5. Generate token
        const token = generateToken(user._id, user.role);

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({
            success: false,
            message: "Admin login failed",
            error: error.message
        });
    }
};