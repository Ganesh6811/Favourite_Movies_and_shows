import { DataTypes } from "sequelize";
import db from "../lib/connectDB.js";
import User from "../models/user.model.js"; // Import your User model

const Item = db.define(
  "Item",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("Movie", "TV Show"),
      allowNull: false,
    },
    director: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    budget: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User, // Can be 'Users' string or User model reference
        key: "id",
      },
      onDelete: "CASCADE", // Optional: delete items if associated user is deleted
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "Item",
    timestamps: false,
  }
);

// Optionally, associate Item with User model
Item.belongsTo(User, { foreignKey: "user_id" });

export default Item;
