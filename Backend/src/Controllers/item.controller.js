import { where } from "sequelize";
import Item from "../models/movie.model.js";

//Add the movies and shows
export const addItem = async (req, res) => {
    try {
        const { title, type, director, budget, location, duration, year } = req.body;
        if (!title || !type || !director) {
            return res.status(400).json({ message: "Title, type, and director are required" });
        }

        const userId = req.user.id;
        const item = await Item.create({ title, type, director, budget, location, duration, year, userId });
        return res.status(201).json({ message: "Item added successfully", item });
    } catch (err) {
        console.error("Error in addItem controller:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//Delete the movies and shows
export const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("id to delete the data is ", id);
        const item = await Item.findByPk(id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        await item.destroy();
        return res.status(200).json({ message: "Item deleted successfully" });
    } catch (err) {
        console.error("Error in deleteItem controller:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//Edit the movies and shows by using the Id
export const editItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, type, director, budget, location, duration, year } = req.body;
        const item = await Item.findByPk(id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        const userId = req.user.id;
        await item.update({ title, type, director, budget, location, duration, year, userId});
        return res.status(200).json({ message: "Item updated successfully", item });
    } catch (err) {
        console.error("Error in editItem controller:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//Get all movies and shows
export const getAllItems = async (req, res) => {
    try {
        const userId = req.user.id;
        const items = await Item.findAll({
            where: {
                userId,
            }
        });
        return res.status(200).json(items);
    } catch (err) {
        console.error("Error in getAllItems controller:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
