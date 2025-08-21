/**
 * server.js
 *
 * Purpose:
 *   Entry point of the Product Inventory System API.
 *   - Loads environment variables from .env.
 *   - Creates and configures the Express application.
 *   - Applies global middleware (JSON body parser, request logging).
 *   - Defines a /health route for quick server + DB status checks.
 *   - Mounts product routes under /api/products.
 *   - Connects to MongoDB before starting the server to ensure DB availability.
 *
 * Features:
 *   - Health route returns { ok, uptime, db } where db = connection state.
 *   - Uses Morgan middleware to log HTTP method, path, and status in terminal.
 *   - Reads PORT from environment variables, defaults to 3000.
 *
 * Startup Flow:
 *   1. Load env variables.
 *   2. Initialize Express app with middleware.
 *   3. Register /health route.
 *   4. Mount productRoutes under /api/products.
 *   5. Connect to MongoDB (via connectDB).
 *   6. Start server listening on PORT once DB is connected.
 *
 * Example:
 *   npm run dev
 *   → Visit http://localhost:3000/health to verify status.
 */

//Imports
import "dotenv/config"; //Loads .env so process.env has MONGODB_URI, PORT
import express from "express"; //Web framework
import morgan from "morgan"; //Request logger to see incoming calls
import { connectDB, dbState } from "./db.js"; // DB connection function
import productRoutes from "./routes/productRoutes.js"; // import routes

// call the app
const app = express();

//Global middleware - run for every request
app.use(express.json()); //parse json bodies into req.body
app.use(morgan("dev")); // Log method, path, status in terminal

//A health route to verify the server is alive
app.get("/health", (req, res) => {
  res.status(200).json({
    ok: true,
    uptime: process.uptime(),
    db: dbState(), // "connected" | "connecting" | "disconnected" | "disconnecting"
  });
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
