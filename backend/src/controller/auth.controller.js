import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { upsertStreamUser, generateStreamToken } from "../lib/stream.js";
import { logChatPromiseExecution } from "stream-chat";

export async function signup(req, res) {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      fullName,
      email,
      password,
      profilePicture: randomAvatar,
    });

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        fullName: newUser.fullName,
        email: newUser.email,
        image: newUser.profilePicture || "",
      });
      console.log("Stream user upserted successfully");
    } catch (error) {
      console.error("Error upserting Stream user:", error);
      throw error;
    }
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: false, // Set to false for development
      sameSite: "lax", // Changed from "strict" to "lax" for development
      path: "/", // Explicitly set path
    });

    res.status(201).json({
      message: "User created successfully",
      token: token,
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    console.log(email, password);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password or email" });
    }

    console.log("User found:", user._id);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("JWT token generated:", token);

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: false, // Set to false for development
      sameSite: "lax", // Changed from "strict" to "lax" for development
      path: "/", // Explicitly set path
    });

    console.log("Cookie set successfully");

    res.status(200).json({
      message: "Login successful",
      token: token, // Also return token for debugging
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// FIXED: Removed duplicate response
export async function onboard(req, res) {
  try {
    const userId = req.user._id;
    const {
      fullName,
      learningLanguage,
      nativeLanguage,
      location,
      bio,
      profilePicture,
    } = req.body;

    if (
      !fullName ||
      !learningLanguage ||
      !nativeLanguage ||
      !location ||
      !bio
    ) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !learningLanguage && "learningLanguage",
          !nativeLanguage && "nativeLanguage",
          !location && "location",
          !bio && "bio",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        image: updatedUser.profilePicture || "",
      });
    } catch (error) {
      console.error("Error during upsertStreamUser:", error);
      return res.status(500).json({ message: "Internal server error" });
    }

    // FIXED: Only one response instead of two
    res.status(200).json({
      success: true,
      message: "Onboarding successful",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error during onboarding:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
