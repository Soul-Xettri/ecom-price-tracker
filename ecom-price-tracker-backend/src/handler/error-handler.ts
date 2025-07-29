import TokenError from "../errors/TokenError";
import DatabaseError from "../errors/DatabaseError";
import BadRequestError from "../errors/BadRequestError";
import DataNotFoundError from "../errors/DataNotFoundError";
import RateLimitError from "../errors/RateLimitError";
import UnauthorizedError from "../errors/UnauthorizedError";
import BaseError from "../errors/BaseError";
import logServerError from "../utils/serverLogger";
import express from "express";

const errorHandlerMiddleware = (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (err) {
    console.error(err);
    let customError = {
      statusCode: err.statusCode || 500,
      msg: err.message || "Something went wrong try again later",
    };

    if (
      !(err instanceof BaseError) &&
      !(err instanceof TokenError) &&
      !(err.message === "jwt expired")
    ) {
      logServerError(err, req);
    }

    if (err.name === "ValidationError") {
      customError.msg = Object.values(err.errors)
        .map((item: any) => item.message)
        .join(",");
      customError.statusCode = 400;
    }
    if (err.code === 11000) {
      const keyValue = err.keyValue ? Object.keys(err.keyValue) : err.keyValue;
      const duplicateFields = Array.isArray(keyValue)
        ? keyValue.join(", ")
        : keyValue;
      customError.msg = `Duplicate value entered for ${duplicateFields} field, please choose another value`;
      customError.statusCode = 400;
    }
    if (err.name === "CastError") {
      customError.msg = `No item found with this Id`;
      customError.statusCode = 404;
    }
    if (err.type === "entity.parse.failed") {
      customError.msg = `Invalid JSON format, please check your request body`;
      customError.statusCode = 400;
    }
    if (err.name === "JsonWebTokenError") {
      customError.msg = `Json Web Token is invalid, Try again `;
      customError.statusCode = 400;
    }
    if (err.name === "TypeError") {
      customError.msg = "Server Error, Try again later";
      customError.statusCode = 500;
    }
    if (err.name === "ReferenceError") {
      customError.msg = "Server Error, Try again later";
      customError.statusCode = 500;
    }
    // JWT EXPIRE error
    if (err.name === "TokenExpiredError") {
      customError.msg = `Json Web Token is Expired, please sign in again `;
      customError.statusCode = 400;
    }
    if (err.name === "SyntaxError") {
      customError.msg = "Invalid JSON format, please check your request body";
      customError.statusCode = 400;
    }

    if (err instanceof RateLimitError) {
      customError.msg = err.message || "Too Many Requests";
      customError.statusCode = 429;
    }

    if (err instanceof TokenError) {
      customError.msg = err.message || "Internal server error";
      customError.statusCode = 401;
    }

    if (err instanceof DatabaseError) {
      customError.msg = err.message || "Internal server error";
      customError.statusCode = 500;
    }

    if (err instanceof DataNotFoundError) {
      customError.msg = err.message || "Data not found";
      customError.statusCode = 404;
    }

    if (err instanceof BadRequestError) {
      customError.msg = err.message || "Bad Request";
      customError.statusCode = 400;
    }

    if (err instanceof UnauthorizedError) {
      customError.msg = err.message || "Unauthorized request";
      customError.statusCode = 403;
    }

    return res.status(customError.statusCode).json({
      status: "fail",
      data: { message: customError.msg },
    });
  } else {
    next();
  }
};

export default errorHandlerMiddleware;
