import { NextFunction, Request, Response } from "express";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";

export const newOrder = async (
  req: Request<{}, {}, NewOrderRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      orderItems,
      shippingCharges,
      discount,
      subTotal,
      tax,
      total,
      user,
    } = req.body;

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
    await invalidateCache({orders: true,product: true,admin: true})
  } catch (error) {}
};
