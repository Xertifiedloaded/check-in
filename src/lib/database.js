import mongoose from 'mongoose';

const databaseConnection = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }

  try {
    await mongoose.connect('mongodb+srv://certifiedloaded:4111@cluster0.se1ihme.mongodb.net/check-in');
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Failed to connect to the database", error);
    throw new Error("Database connection failed");
  }
};

export default databaseConnection;

