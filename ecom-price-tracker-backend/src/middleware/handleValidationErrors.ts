import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const handleValidationErrors = function () {
  return function (req: Request, res: Response, next: NextFunction) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorArray = errors.array();
      const customError = errorArray[0];
      const status = 400; // Always use 400 for validation errors
      const message = customError.msg;
      return res.status(status).json({
        status: "fail",
        data: {
          message: message,
        },
      });
    }

    next();
  };
};

export default handleValidationErrors;
