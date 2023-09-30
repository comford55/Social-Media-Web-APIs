import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const uri: string = process.env.DB_CONN_STRING!;
const dbName: string = process.env.DB_NAME || "sns";

export const connection = mongoose
    .connect(uri+dbName)
    .then(() => {
        console.log("Database connected!");
    })
    .catch((err) => {
        console.log(err);
    });