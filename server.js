// This file will boot the app. Load env, create Express app, add JSON parsing, connect to DB,
// then start listening. Includes a health route for a quick check.

//Imports
import "dotenv/config"; //Loads .env so process.env has MONGODB_URI, PORT
import express from "express"; //Web framework
import morgan from "morgan"; //Request logger to see incoming calls
import { connectDB } from "./db.js"; // DB connection function
import productRoutes from "./routes/productRoutes.js"; // import routes

// call the app
const app = express();

//Global middleware - run for every request
app.use(express.json()); //parse json bodies into req.body
app.use(morgan("dev")); // Log method, path, status in terminal

//A health route to verify the server is alive
app.get("/health", (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

// Route so /api/products will work
app.use("/api/products", productRoutes);

//Choose a port from.env, default to 3000 if missing.
const PORT = process.env.PORT || 3000;

//Connect to DB first, then start the server.
//This guarantees routes wont run without a DB
connectDB(process.env.MONGODB_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
