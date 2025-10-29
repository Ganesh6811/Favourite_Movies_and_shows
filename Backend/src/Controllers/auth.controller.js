import User from "../models/user.model.js";
import generateToken from "../lib/utils.js";
import bcrypt from "bcrypt";


export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            console.log("All fields must be entered");
            return res.status(400).json({ message: "All fields must be entered" });
        }

        const check = await User.findOne({
            where: {
                email,
            }
        });

        console.log(" in the signup controller the value of the check is ", check);

        if (check) {
            console.log("Email  already exists");
            return res.status(400).json({ message: "Email  already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const data = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        generateToken(res, data);

        return res.status(201).json({ message: "User Signed Up successfully" });
    }
    catch (err) {
        console.log("Error in signUp controller:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            console.log("All fields must be entered");
            return res.status(400).json({ message: "All fields must be entered" });
        }

        const checkEmail = await User.findOne({
            where: {
                email,
            }
        });

        if (!checkEmail) {
            console.log("Enter the valid creadentails");
            return res.status(400).json({ message: "Enter the valid creadentails" });
        }

        const checkPassword = await bcrypt.compare(password, checkEmail.password);

        if (!checkPassword) {
            console.log("Enter the valid creadentails");
            return res.status(400).json({ message: "Enter the valid creadentails" });
        }

        generateToken(res, checkEmail);

        return res.status(200).json({ message: "User Logged in successfully" });
    }
    catch (err) {
        console.log("error in login controller:", err);
    }
}


export const logOut = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (err) {
        console.log("Error in logOut controller:", err);
        return res.status(500).json("Internal Server Error");
    }
}


export const checkAuth = async(req, res)=>{
    try{
        res.status(200).json(req.user);
    }
    catch(err){
        console.log("Error in checkAuth controller:", err);
        res.status(500).json({message:"Internal Server Error"});
    }
}