import { serverLog } from "../logs/serverLog";

const logServerError = (err: any, req: any) => {
  serverLog.error({
    message: err.message || "Something went wrong try again later",
    ip: req.ip,
    userId: req.user ? req.user._id : "unknown",
    businessUsername: req.business ? req.business.username : "unknown",
    additionalInfo: {
      method: req.method,
      url: req.originalUrl,
      stack: err.stack,
      payload: req.body,
    },
  });
};

export default logServerError;
