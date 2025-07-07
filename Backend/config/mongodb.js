// import mongoose from "mongoose";

// const connectDB = async () => {
// mongoose.connection.on('connected', () => {
//     console.log("DB Connected");
// });

// await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`);
// }

// export default connectDB;


import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // ← مهم جدًا لتحميل متغيرات .env

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB Connected");
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;

