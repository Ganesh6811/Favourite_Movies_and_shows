import { Router } from "express";
import { getAllItems, deleteItem, addItem, editItem } from "../Controllers/item.controller.js"; 
import {protectedRoute} from "../middleware/protectedRoute.js"

const router = Router();

router.get("/getAllItems", protectedRoute, getAllItems);
router.delete("/deleteItem/:id", protectedRoute, deleteItem);
router.post("/addItem",protectedRoute,  addItem);
router.put("/editItem/:id", protectedRoute, editItem);

export default router;