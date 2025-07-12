import constants from "../constants.js";


const errorHandlers = (error, req, res, next) => {
    const statusCode = res.statusCode || 500;
    let errorResponse = {
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    }

    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            errorResponse.message = "Validation error";
            break;
        case constants.UNDEFINED_ERROR:
            errorResponse.message = "Unknown error";
            break;
        case constants.FORBIDDEN:
            errorResponse.message = "Forbidden";
            break;
        case constants.NOT_FOUND:
            errorResponse.message = "Not Found";
            break;
        case constants.SERVER_ERROR:
            errorResponse.message = "Server Error";
            break;
        default:
            errorResponse.message = error;
    }
    res.status(statusCode).json(errorResponse);

}