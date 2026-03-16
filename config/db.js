const mongoose = require("mongoose");

let isConnected = false; // track connection

const connectDB = async () => {
  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    mongoose.set("strictQuery", false); // optional, prevents warnings
    const db = await mongoose.connect(process.env.MONGO_URI, {
      // optional settings for better serverless behavior
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = db.connections[0].readyState;
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

module.exports = connectDB;