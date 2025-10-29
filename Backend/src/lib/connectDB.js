import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config(); 


const db = new Sequelize(
    process.env.mySql_DB_name,
    process.env.mySql_USER,
    process.env.mySql_password,
    {
        host:process.env.mySql_HOST,
        dialect:process.env.mysql_DIALECT
    }
);

export default db;