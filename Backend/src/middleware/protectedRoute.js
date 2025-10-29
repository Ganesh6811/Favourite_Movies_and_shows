import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectedRoute = async(req, res, next)=>{
    try{
        const token = req.cookies.jwt;
        if(!token){
            console.log("Token is not provided");
            return res.status(400).json({message:"Invalid Credentails"});
        }

        const checkToken = jwt.verify(token, process.env.JWT_SECREATE_KEY);
        console.log("Token data is", checkToken);
        const user = await User.findOne({ where: { id: checkToken.id } });


        if(!user){
             console.log("Invalid Credentails");
            return res.status(400).json({message:"Invalid Credentails"});
        }

        req.user = user;
        next();
    }
    catch(err){
        console.log("Error in the protected Route:", err);
        res.status(500).json({message:"Internal Server Error"});
    }
}