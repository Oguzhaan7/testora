import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://localhost:27017/testora";

    await mongoose.connect(mongoUri, {
      retryWrites: true,
      w: "majority",
    });

    console.log("✅ MongoDB connected successfully");

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB disconnected");
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("📴 MongoDB connection closed through app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
  console.log("📴 MongoDB disconnected manually");
};
