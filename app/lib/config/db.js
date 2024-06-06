import mongoose from "mongoose";
require("dotenv").config();

export const ConnectDB = async () => {
  await mongoose.connect(process.env.DB);
  console.log("DB connected");
};
