import mongoose from "mongoose";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import { Order } from "../models/order.js";
export const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri);
        console.log("MongoDB Connected");
    }
    catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
};
export const invalidateCache = async ({ product, admin, orders, userId, }) => {
    if (product) {
        const productKeys = ["latest-product", "products", "allCategories"];
        const products = await Product.find({}).select("_id");
        products.forEach((pro) => {
            productKeys.push(`product-${pro._id}`);
        });
        myCache.del(productKeys);
    }
    if (orders) {
        const ordersKeys = ["my-order", `my-order-${userId}`];
        const orders = await Order.find({}).select("_id");
        orders.forEach((o) => {
            ordersKeys.push(`my-order-${o._id}`);
        });
        myCache.del(ordersKeys);
    }
};
export const reduceStock = async (orderItems) => {
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
export const getRecordsByDateRange = async (Model, start, end) => {
    return await Model.find({
        createdAt: {
            $gte: start,
            $lte: end,
        },
    });
};
export const calculatePercentage = (thisMonth, lastMonth) => {
    if (lastMonth === 0) {
        return thisMonth * 100;
    }
    const percent = (thisMonth / lastMonth) * 100;
    return percent;
};
export const getInventories = async ({ categories, productsCount, }) => {
    const categoriesCountPromise = categories.map((category) => Product.countDocuments({ category }));
    const categoriesCount = await Promise.all(categoriesCountPromise);
    const categoryCount = [];
    categories.forEach((category, i) => {
        categoryCount.push({
            [category]: Math.round((categoriesCount[i] / productsCount) * 100),
        });
    });
    return categoryCount;
};
