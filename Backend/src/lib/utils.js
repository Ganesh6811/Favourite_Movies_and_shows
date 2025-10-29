import jwt from "jsonwebtoken";

const generateToken = async (res, data) => {
    try {
        const token = jwt.sign({
            id: data.id,
            name: data.name,
            email: data.email,
        },
            process.env.JWT_SECREATE_KEY,
            { expiresIn: "7D" }
        );

        res.cookie("jwt", token, { 
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "None"
        });
    }
    catch (err) {
        console.log("Error while generate token:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export default generateToken;