// Verify that MONGODB_URI in .env is correct by attempting a simple connect + disconnect.

// 1) Load environment variables from .env so process.env.MONGODB_URI is available.
import "dotenv/config";

// 2) Import mongoose, the library that manages the MongoDB connection.
import mongoose from "mongoose";

async function main() {
  try {
    // 3) Try to connect using the exact URI from your .env.
    // If the URI is wrong (bad password, IP not allowed, etc.), this will throw an error.
    await mongoose.connect(process.env.MONGODB_URI);

    // 4) If we reached here, the connection worked.
    console.log("✅ Connected to MongoDB successfully!");

    // 5) Always clean up connections in small scripts.
    await mongoose.disconnect();
    console.log("🔌 Disconnected cleanly. Your URI looks good.");
  } catch (err) {
    // 6) If something failed, show a friendly message with the actual error text.
    console.error("❌ Failed to connect. Check your MONGODB_URI.");
    console.error("Reason:", err.message);

    // 7) Exit with non-zero code so this script signals failure to the shell (good practice).
    process.exit(1);
  }
}

// 8) Run the async function.
main();
