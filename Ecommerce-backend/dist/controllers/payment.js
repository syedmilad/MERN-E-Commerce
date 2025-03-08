import { Coupen } from "../models/coupen.js";
import ErrorHandler from "../utils/utility-class.js";
export const newCreateCoupen = async (req, res, next) => {
    try {
        const { code, amount } = req.body;
        if (!code || !amount) {
            return next(new ErrorHandler("Please add both feilds", 404));
        }
        console.log("before");
        await Coupen.create({ code, amount });
        console.log("after");
        return res.status(200).json({
            success: true,
            message: "Coupen Created Successfully",
        });
    }
    catch (error) {
        return res.status(404).json({
            success: false,
            message: error,
        });
    }
};
export const discount = async (req, res, next) => {
    try {
        const { coupen } = req.query;
        const discount = await Coupen.findOne({ code: coupen });
        if (!discount) {
            return next(new ErrorHandler("Invalid Coupen Code", 400));
        }
        res.status(200).json({
            success: true,
            discount: discount.amount,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error,
        });
    }
};
export const allCoupens = async (req, res, next) => {
    try {
        const allCoupens = await Coupen.find({});
        console.log({ coupen: allCoupens });
        res.status(200).json({
            success: true,
            allCoupens,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error,
        });
    }
};
export const coupenDelete = async (req, res, next) => {
    try {
        console.log("callling...");
        const { id } = req.params;
        console.log({ id });
        const coupen = await Coupen.findById(id);
        if (!coupen) {
            return next(new ErrorHandler("Invalid Coupen Provided", 404));
        }
        await coupen?.deleteOne();
        console.log({ coupen });
        res.status(200).json({
            success: true,
            message: "Coupen Deleted Successfully",
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error,
        });
    }
};
