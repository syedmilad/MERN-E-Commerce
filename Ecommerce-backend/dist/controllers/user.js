import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
export const newUser = async (req, res, next) => {
    try {
        const { name, email, _id, photo, role, dob, gender } = req.body;
        let user = await User?.findById(_id);
        if (user) {
            return res.status(201).json({
                succes: true,
                message: `Welcome ${user.name}`,
            });
        }
        if (!_id || !name || !photo || !dob || !gender || !email) {
            return next(new ErrorHandler("Please Add all feilds", 400));
        }
        user = await User.create({
            name,
            email,
            _id,
            photo,
            role,
            gender,
            dob: new Date(dob),
        });
        return res.status(200).json({
            success: true,
            message: `Welcome, ${user.name}`,
        });
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: error,
        });
    }
};
export const getAllUser = async (req, res, next) => {
    try {
        const users = await User.find({});
        if (users?.length) {
            res.status(201).json({
                success: true,
                users: users,
            });
        }
        else {
            res.status(201).json({
                success: true,
                message: "empty user collection",
            });
        }
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error,
        });
    }
};
export const getUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) {
            return next(new ErrorHandler("Invalid Id", 404));
        }
        else {
            res.status(201).json({
                success: true,
                user,
            });
        }
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error,
        });
    }
};
export const userDelete = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) {
            return next(new ErrorHandler("Invalid Id", 404));
        }
        await user.deleteOne();
        return res.status(201).json({
            success: true,
            message: "User Delected Successfully",
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error,
        });
    }
};
