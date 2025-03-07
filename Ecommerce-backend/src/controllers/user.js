import { User } from "../models/user.js";
export const newUser = async (req, res, next) => {
    try {
        const { name, email, _id, photo, role, dob, gender } = req.body;
        const user = await User.create({
            name,
            email,
            _id,
            photo,
            role,
            dob,
            gender,
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
