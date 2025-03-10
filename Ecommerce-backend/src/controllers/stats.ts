import { NextFunction, Request, Response } from "express";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import {
  calculatePercentage,
  getInventories,
  getRecordsByDateRange,
} from "../utils/features.js";
import { User } from "../models/user.js";
import { Order } from "../models/order.js";
import { markAsUntransferable } from "worker_threads";

export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let stats = {};
    if (myCache.has("admin-stats")) {
      stats = JSON.parse(myCache.get("admin-stats") as string);
    } else {
      const today = new Date();
      const sixMonthAgo = new Date();
      sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);
      console.log({ sixMonthAgo });
      const thisMonth = {
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: today,
      };
      const lastMonth = {
        start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        end: new Date(today.getFullYear(), today.getMonth(), 0),
      };
      /** These are below Promises */
      const thisMonthProducts = getRecordsByDateRange(
        Product,
        thisMonth.start,
        thisMonth.end
      );
      const lastMonthProducts = getRecordsByDateRange(
        Product,
        lastMonth.start,
        lastMonth.end
      );

      const thisMonthUsers = getRecordsByDateRange(
        User,
        thisMonth.start,
        thisMonth.end
      );
      const lastMonthUsers = getRecordsByDateRange(
        User,
        lastMonth.start,
        lastMonth.end
      );

      const thisMonthOrders = getRecordsByDateRange(
        Order,
        thisMonth.start,
        thisMonth.end
      );
      const lastMonthOrders = getRecordsByDateRange(
        Order,
        lastMonth.start,
        lastMonth.end
      );

      const lastSixMonthAgoOrderPromise = getRecordsByDateRange(
        Order,
        sixMonthAgo,
        today
      );

      const latestTransactionPromise = Order.find({})
        .select(["orderItems", "discount", "total", "status"])
        .limit(4);

      const [
        thisMonthProduct,
        lastMonthProdcuct,
        thisMonthUserD,
        lastMonthUserd,
        thisMonthOrdersd,
        lastMonthOrdersd,
        productsCount,
        usersCount,
        allOrders,
        lastSixMonthOrder,
        categories,
        femaleCounts,
        latestTransaction,
      ] = await Promise.all([
        thisMonthProducts,
        lastMonthProducts,
        thisMonthUsers,
        lastMonthUsers,
        thisMonthOrders,
        lastMonthOrders,
        Product.countDocuments(),
        User.countDocuments(),
        Order.find({}).select("total"),
        lastSixMonthAgoOrderPromise,
        Product.distinct("category"),
        User.countDocuments({ gender: "female" }),
        latestTransactionPromise,
      ]);

      console.log({
        thisMonthUserD,
        lastMonthUserd,
        thisMonthProduct,
        lastMonthProdcuct,
        thisMonthOrdersd,
        lastMonthOrdersd,
        categories,
      });

      const modifiedTransaction = latestTransaction.map((t, i) => {
        return {
          _id: t._id,
          amount: t.total,
          discount: t.discount,
          quantity: t.orderItems.length,
          status: t.status,
        };
      });

      const thisMonthRevenue = thisMonthOrdersd.reduce(
        (total: any, order: any) => total + (order.total || 0),
        0
      );
      const lastMonthRevenue = lastMonthOrdersd.reduce(
        (total: any, order: any) => total + (order.total || 0),
        0
      );

      const revenueInNumber = allOrders.reduce(
        (total, order) => total + (order.total || 0),
        0
      );

      const orderMonthCount = new Array(6).fill(0);
      const orderMonthlyRevenue = new Array(6).fill(0);

      lastSixMonthOrder.forEach((order, index) => {
        const creationDate = order.createdAt;
        const monthDiff = ((today.getMonth() - creationDate.getMonth()) + 12) % 12;

        if (monthDiff < 6) {
          orderMonthCount[6 - monthDiff - 1] += 1;
          orderMonthlyRevenue[6 - monthDiff - 1] += order.total;
        }
      });

      const categoryCount = await getInventories({ categories, productsCount });

      console.log({ categoryCount });

      const userRatio = {
        male: usersCount - femaleCounts,
        female: femaleCounts,
      };

      stats = {
        changePercent: {
          reveneu: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
          product: calculatePercentage(
            thisMonthProduct.length,
            lastMonthProdcuct.length
          ),
          user: calculatePercentage(
            thisMonthUserD.length,
            lastMonthUserd.length
          ),
          order: calculatePercentage(
            thisMonthOrdersd.length,
            lastMonthOrdersd.length
          ),
        },
        count: {
          revenue: revenueInNumber,
          user: usersCount,
          product: productsCount,
          orders: allOrders.length,
          chart: {
            order: orderMonthCount,
            revenue: orderMonthlyRevenue,
          },
        },
        categoryCount,
        userRatio,
        latestTransaction: modifiedTransaction,
      };
      myCache.set("admin-stats", JSON.stringify(stats));
    }

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error,
    });
  }
};

export const getPieCharts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("calling... get pie charts");
    let charts = {};
    if (myCache.has("admin-stats-pie")) {
      charts = JSON.parse(myCache.get("admin-stats-pie") as string);
    } else {
      const [
        processingOrder,
        shippedOrder,
        deliveredOrder,
        categories,
        productsCount,
        outOfStock,
        allOrders,
        allUser,
        adminCounts,
        userCounts,
      ] = await Promise.all([
        Order.countDocuments({ status: "Processing" }),
        Order.countDocuments({ status: "Shipped" }),
        Order.countDocuments({ status: "Delivered" }),
        Product.distinct("category"),
        Product.countDocuments(),
        Product.countDocuments({ stock: 0 }),
        Order.find({}).select([
          "total",
          "subTotal",
          "tax",
          "shippingCharges",
          "discount",
        ]),
        User.find({}).select("dob"),
        User.countDocuments({roll: "admin"}),
        User.countDocuments({roll: "user"})
      ]);
      console.log({ processingOrder, shippedOrder, deliveredOrder });
      const orderFullfilled = {
        processing: processingOrder,
        shipped: shippedOrder,
        delivered: deliveredOrder,
      };
      const adminCustomer = {
        admin: adminCounts,
        user: userCounts
      }
      const categoryCount = await getInventories({ categories, productsCount });
      console.log({ orderFullfilled });
      console.log({ productsCount, outOfStock });

      const grossIncome = allOrders.reduce(
        (prev, order) => (prev += order.total || 0),
        0
      );
      const discount = allOrders.reduce(
        (prev, order) => (prev += order.discount || 0),
        0
      );
      const productionCost = allOrders.reduce(
        (prev, order) => (prev += order.shippingCharges || 0),
        0
      );
      const burnt = allOrders.reduce(
        (prev, order) => (prev += order.tax || 0),
        0
      );
      const marketingCost = grossIncome * (30 / 100);
      const netMargin =
        grossIncome - discount - productionCost - burnt - marketingCost;

      const revenueDistribution = {
        netMargin,
        discount,
        productionCost,
        burnt,
        marketingCost,
      };

      const productAvailibility = {
        inStock: productsCount - outOfStock,
        outOfStock,
      };
      const userAgeGroup = {
        teen: allUser.filter((user,index)=> user.age < 20).length,
        adults: allUser.filter((user,index)=> user.age >  20 && user.age < 40).length,
        old: allUser.filter((user,index)=> user.age >= 40).length
      }
      charts = {
        orderFullfilled,
        categoryCount,
        productAvailibility,
        revenueDistribution,
        userAgeGroup,
        adminCustomer,
      };
      myCache.set("admin-stats-pie", JSON.stringify(charts));
    }

    res.status(201).json({
      success: true,
      charts,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error,
    });
  }
};

export const getBarCharts = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const getLineCharts = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
