import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import route from "./route/user.route.js";


const app = express();
app.use(cors());
app.use(express.json())
app.use(cookieParser())
dotenv.config();
app.use('/api/user', route)

const PORT = process.env.PORT || 8080
const MongoURL = process.env.MONGODBURL;

mongoose.connect(MongoURL).then(() => {
    console.log("Mongo DB Connect Successfully");
    app.listen(PORT, () => {
      console.log(`Server is Running on ${PORT}`);
    });
  }).catch((error) => console.log(error))
