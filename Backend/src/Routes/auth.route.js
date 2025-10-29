import { Router } from "express";
import { logOut, login, signUp, checkAuth } from "../Controllers/auth.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const router = Router();

router.post("/login", login);
router.delete("/logOut", logOut);
router.post("/signUp", signUp);
router.get("/checkAuth",protectedRoute, checkAuth);


export default router;