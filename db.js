// File exposes a single function that connects to MongoDB using Mongoose
// This keeps server.js strictly for HTTP concerns (New practice)
// Notes for user: Import connectDB in server.js and call it before app.listen

//Import mongoose
import mongoose from "mongoose";

export async function connectDB(uri) {
  //Makes query behavior a bit stricter
  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    //If DB fails, exit so you fix it instead of running half-broken server
    process.exit(1);
  }
}
