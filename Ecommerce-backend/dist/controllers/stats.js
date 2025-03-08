import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import { getRecordsByDateRange } from "../utils/features.js";
import { User } from "../models/user.js";
import { Order } from "../models/order.js";
export const getDashboardStats = async (req, res, next) => {
    try {
        let stats = {};
        if (myCache.has("admin-stats")) {
            stats = JSON.parse(myCache.get("admin-stats"));
        }
        else {
            const today = new Date();
            const thisMonth = {
                start: new Date(today.getFullYear(), today.getMonth(), 1),
                end: today,
            };
            const lastMonth = {
                start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
                end: new Date(today.getFullYear(), today.getMonth(), 0),
            };
            /** These are below Promises */
            const thisMonthProducts = getRecordsByDateRange(Product, thisMonth.start, thisMonth.end);
            const lastMonthProducts = getRecordsByDateRange(Product, lastMonth.start, lastMonth.end);
            const thisMonthUsers = getRecordsByDateRange(User, thisMonth.start, thisMonth.end);
            const lastMonthUsers = getRecordsByDateRange(User, lastMonth.start, lastMonth.end);
            const thisMonthOrders = getRecordsByDateRange(Order, thisMonth.start, thisMonth.end);
            const lastMonthOrders = getRecordsByDateRange(Order, lastMonth.start, lastMonth.end);
            const [thisMonthProduct, lastMonthProdcuct, thisMonthUserD, lastMonthUserd, thisMonthOrdersd, lastMonthOrdersd] = await Promise.all([thisMonthProducts, lastMonthProducts, thisMonthUsers, lastMonthUsers, thisMonthOrders, lastMonthOrders]);
            console.log({ thisMonthUserD, lastMonthUserd, thisMonthProduct, lastMonthProdcuct, thisMonthOrdersd, lastMonthOrdersd });
        }
        res.status(200).json({
            success: true,
            stats,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error,
        });
    }
};
export const getPieCharts = (req, res, next) => { };
export const getBarCharts = (req, res, next) => { };
export const getLineCharts = (req, res, next) => { };
