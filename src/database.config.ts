require("dotenv").config();

import { connect, ConnectOptions } from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI: string = process.env.DEV_MONGO_URI;
    const options: ConnectOptions = {
      autoIndex: false,
      serverSelectionTimeoutMS: 5000,
      family: 4,
    };
    await connect(mongoURI, options);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
