import mongoose from "mongoose";

/**
 * Connects the application to the MongoDB database using the URI provided in environment variables.
 * Exits the process if the connection fails.
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Exit the process with failure code if database connection is critical
    process.exit(1);
  }
};

