const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
    console.log(err);
    const defaultErorr = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || "Something went wrong, please try again later",
    };
    if (err.name === "ValidationError") {
        defaultErorr.statusCode = StatusCodes.BAD_REQUEST;
        defaultErorr.message = Object.values(err.errors)
            .map((item) => {
                return item.message;
            })
            .join(",");
    }
    if (err.code === 11000) {
        defaultErorr.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
        defaultErorr.message = `${Object.keys(
            err.keyValue
        )} field has to be uniqe`;
    }
    res.status(defaultErorr.statusCode).json({
        message: defaultErorr.message,
    });
};
module.exports = { errorHandler };
