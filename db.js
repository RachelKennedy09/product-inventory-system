// db.js
import mongoose from "mongoose";

const readyMap = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

export function dbState() {
  return readyMap[mongoose.connection.readyState] || "unknown";
}

export async function connectDB(uri) {
  if (!uri) {
    console.error("MONGODB_URI missing. Check your .env");
    process.exit(1);
  }

  mongoose.set("strictQuery", true);

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }

  // connection event logs
  mongoose.connection.on("disconnected", () =>
    console.warn(" MongoDB disconnected")
  );
  mongoose.connection.on("reconnected", () =>
    console.log(" MongoDB reconnected")
  );
}

/**  export for tests */
export async function disconnectDB() {
  await mongoose.disconnect();
}
