/**
 * db.js
 *
 * Purpose:
 *   Centralizes MongoDB connection logic for the Product Inventory System API.
 *   Provides helper functions to connect, disconnect, and check the current DB state.
 *   Keeps database code separated from application logic for cleaner organization.
 *
 * Exports:
 *   - connectDB(uri):
 *       Connects to MongoDB using the provided URI.
 *       Logs connection events and exits the process on failure.
 *
 *   - disconnectDB():
 *       Gracefully closes the MongoDB connection (used in tests or shutdown).
 *
 *   - dbState():
 *       Returns a human-readable string of the current connection state:
 *       "disconnected" | "connected" | "connecting" | "disconnecting".
 *
 * Features:
 *   - Sets mongoose strictQuery mode for safer queries.
 *   - Logs status changes (connected, disconnected, reconnected).
 *   - Validates that a MONGODB_URI is provided, otherwise stops the server.
 *
 * Example Usage:
 *   import { connectDB, dbState, disconnectDB } from "./db.js";
 *   await connectDB(process.env.MONGODB_URI);
 *   console.log("DB status:", dbState());
 */

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
