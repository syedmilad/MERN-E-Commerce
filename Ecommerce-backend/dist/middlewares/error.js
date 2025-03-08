export const errorMiddleWare = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;
    if (err.name === "CastError")
        err.message = "Invalid Id";
    return res.status(err.statusCode).json({
        success: err.statusCode,
        message: err.message,
    });
};
export const TryCatch = (func) => (req, res, next) => {
    return Promise.resolve(func(req, res, next)).catch(next);
};
