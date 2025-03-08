import express from "express";
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";
import paymentRoutes from "./routes/payment.js";
import { connectDB } from "./utils/features.js";
import { errorMiddleWare } from "./middlewares/error.js";
import NodeCache from "node-cache";
import { config } from "dotenv";
import morgan from "morgan"

export const myCache = new NodeCache()

config({
  path: "./.env"
})
const PORT = process.env.PORT || 6060 ;
const mongoURI = process.env.MONGO_URI || ""
connectDB(mongoURI);

const app = express();
app.use(express.json());
app.use(morgan("dev"))

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send("Working API with /api/v1");
});

app.use(errorMiddleWare)
app.use("/uploads",express.static("uploads"))

app.listen(PORT, () => {
  console.log(`server is running on PORT asdfads http://localhost:${PORT} `);
});
