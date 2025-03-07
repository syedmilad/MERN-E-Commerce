import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://syedmilad245:UpJTWbEWVLkCL1X0@cluster0.ydtaa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log("MongoDB Connected");
    }
    catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
};
