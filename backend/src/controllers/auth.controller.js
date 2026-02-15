import User from "../models/User.js";
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js";

export const signup = async (req,res) => {
    const {fullName, email, password} = req.body
    const name = fullName.trim()
    const normalizedEmail = email.trim().toLowerCase()

    try {
        if(!name || !normalizedEmail || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        if(password.length < 6){
            return res.status(400).json({message:"Password Must be at least 6 characters"})
        }

        // check email vaild or not
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
        return res.status(400).json({ message: "Invalid email format" });
        }


        const user =  await User.findOne({email:normalizedEmail})
        if(user) {
            return res.status(400).json({message:"Email already exists"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            fullName:name,
            email:normalizedEmail,
            password: hashedPassword
        })

        if(newUser){
            generateToken(newUser._id,res)

            await newUser.save()

            return res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic
            })

        }else{
            return res.status(400).json({message:"Invalid user data"})
        }
        
        
    } catch (error) {
        console.log("Error in singup controller")
        res.status(500).json({ message:"Internal Server Error"})
    }



    res.send("signup endpoint")
}

export const login = async (req,res) => {
    res.send("login endpoint")
}

export const logout = async (req,res) => {
    res.send("logout endpoint")
}