import { Order } from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";
export const newOrder = async (req, res, next) => {
    try {
        const { orderItems, shippingCharges, discount, subTotal, tax, total, user, shippingInfo, } = req.body;
        console.log("req.body==>", {
            orderItems,
            shippingCharges,
            discount,
            subTotal,
            tax,
            total,
            user,
            shippingInfo,
        });
        if (!orderItems ||
            !shippingCharges ||
            !subTotal ||
            !tax ||
            !total ||
            !user ||
            !shippingInfo) {
            return next(new ErrorHandler("Required All Feilds", 404));
        }
        await Order.create({
            orderItems,
            shippingCharges,
            discount,
            subTotal,
            tax,
            total,
            user,
            shippingInfo,
        });
        await reduceStock(orderItems);
        await invalidateCache({ orders: true, product: true, admin: true, userId: user });
        res.status(201).json({
            success: true,
            message: "Order Placed Successfully",
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error,
        });
    }
};
export const myOrders = async (req, res, next) => {
    try {
        const { id: user } = req.query;
        let orders = [];
        const key = `my-order-${user}`;
        if (myCache.has(key)) {
            orders = JSON.parse(myCache.get(key));
        }
        else {
            orders = await Order.find({ user: user }); /** User Id. */
            myCache.set(key, JSON.stringify(orders));
        }
        console.log({ orders });
        res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error,
        });
    }
};
export const allOrders = async (req, res, next) => {
    try {
        let orders = [];
        const key = `my-order`;
        if (myCache.has(key)) {
            orders = JSON.parse(myCache.get(key));
        }
        else {
            orders = await Order.find({}).populate("user", "name");
            myCache.set(key, JSON.stringify(orders));
        }
        console.log({ orders });
        res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error,
        });
    }
};
export const getSingleOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        let order;
        const key = `my-order-${id}`;
        if (myCache.has(key)) {
            order = JSON.parse(myCache.get(key));
        }
        else {
            order = await Order.findById(id).populate("user", "name");
            if (!order) {
                return next(new ErrorHandler("Order Not Found", 404));
            }
            myCache.set(key, JSON.stringify(order));
        }
        console.log({ order });
        res.status(200).json({
            success: true,
            order,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error,
        });
    }
};
export const orderProcessing = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order) {
            return next(new ErrorHandler("Order Not Found", 404));
        }
        switch (order.status) {
            case "Processing":
                order.status = "Shipped";
                break;
            case "Shipped":
                order.status = "Delivered";
                break;
            default:
                order.status = "Delivered";
                break;
        }
        await order.save();
        await invalidateCache({ product: false, orders: true, admin: true, userId: order.user });
        res.status(200).json({
            success: true,
            order,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error,
        });
    }
};
export const deleteOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order) {
            return next(new ErrorHandler("Order Not Found", 404));
        }
        await order.deleteOne();
        await invalidateCache({ product: false, orders: true, admin: true, userId: order.user });
        res.status(200).json({
            success: true,
            message: "Order Deleted Successfully",
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error,
        });
    }
};
