import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js"
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { ENV } from "../lib/env.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  const name = fullName.trim();
  const normalizedEmail = email.trim().toLowerCase();

  try {
    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password Must be at least 6 characters" });
    }

    // check email vaild or not
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName: name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    if (newUser) {
      // generateToken(newUser._id,res)
      // await newUser.save()

      const savedUser = await newUser.save();
      generateToken(savedUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
      try {
        await sendWelcomeEmail(
          savedUser.fullName,
          savedUser.email,
          ENV.CLIENT_URL,
        );
      } catch (error) {
        console.error("Failed to send welcome email:", error);
      }
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in singup controller");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    if (!normalizedEmail || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (_, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    // res.clearCookie("jwt",{
    //   httpOnly:true,
    // })
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller");
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const updateProfile = async (req,res) => {
try {
  const {profilePic} = req.body
    if (!profilePic) return res.status(400).json({ message: "Profile pic is required" });

    const userId = req.user._id
    const uploadResponse = await cloudinary.uploader.upload(profilePic)

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {profilePic: uploadResponse.secure_url},
      {new:true}
    )
    res.status(200).json(updatedUser);
} catch (error) {
   console.log("Error in update profile:", error);
    res.status(500).json({ message: "Internal server error" })
  
}  
}