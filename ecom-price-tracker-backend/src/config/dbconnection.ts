import mongoose from "mongoose";

const mongoConnection = async () => {
  const dbUri =
    process.env.NODE_ENV === "development"
      ? process.env.MONGO_URI
      : process.env.MONGO_URI;
  try {
    if (!dbUri) {
      throw new Error("MONGO_URI is not defined in environment variables.");
    }
    await mongoose.connect(dbUri);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
  });
};

export default mongoConnection;
