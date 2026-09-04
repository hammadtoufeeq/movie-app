import mongoose from "mongoose";



const MONGO_URI = process.env.MONGO_URI;

 export async function connectdb() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("MongoDB connection error:", error);
        process.exit(1);
    }
}

