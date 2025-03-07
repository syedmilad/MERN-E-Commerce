import { Order } from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
export const newOrder = async (req, res, next) => {
    try {
        const { orderItems, shippingCharges, discount, subTotal, tax, total, user, } = req.body;
        await Order.create({
            orderItems,
            shippingCharges,
            discount,
            subTotal,
            tax,
            total,
            user,
        });
        await reduceStock(orderItems);
        await invalidateCache({ orders: true, product: true, admin: true });
    }
    catch (error) { }
};
