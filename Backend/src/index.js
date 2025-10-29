import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoute from "./Routes/auth.route.js";
import itemRoute from "./Routes/item.route.js";
import db from "./lib/connectDB.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    methods:["GET", "PUT", "POST", "DELETE"],  
    allowedHeaders: ["Content-Type", "Authorization"], 
}));

app.use("/auth", authRoute);
app.use("/item", itemRoute);

app.listen(port, async () => {
    await db.authenticate();
    await db.sync({ alter: true })
        .then(() => console.log("✅ Database synced successfully"))
        .catch((err) => console.error("❌ Error syncing database:", err));
    console.log(`Server is listening on port ${port}`);
});