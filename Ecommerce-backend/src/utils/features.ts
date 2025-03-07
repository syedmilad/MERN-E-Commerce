import mongoose from "mongoose";
import { InvalidateCacheProps, orderItemTypes } from "../types/types.js";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";

export const connectDB = async (uri: string) => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export const invalidateCache = async ({
  product,
  admin,
  orders,
}: InvalidateCacheProps) => {
  if (product) {
    const productKeys = ["latest-product", "products", "allCategories"];
    const products = await Product.find({}).select("__id");
    products.forEach((pro) => {
      productKeys.push(`product-${pro._id}`);
    });
    myCache.del(productKeys);
  }
};

export const reduceStock = async (orderItems: orderItemTypes[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.productId);
    if (!product) {
      throw new Error("Product not found");
    }
    product.stock -= order.quantity;
    await product.save();
  }
};
