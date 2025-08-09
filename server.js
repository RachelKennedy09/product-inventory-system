// This file will boot the app. Load env, create Express app, add JSON parsing, connect to DB,
// then start listening. Includes a health route for a quick check.

//Imports
import "dotenv/config"; //Loads .env so process.env has MONGODB_URI, PORT
import express from "express"; //Web framework
import morgan from "morgan"; //Request logger to see incoming calls
import { connectDB } from "./db.js" // DB connection function 

// call the app
const app = express();


//Global middleware - run for every request
app.use(express.json()); //parse json bodies into req.body
