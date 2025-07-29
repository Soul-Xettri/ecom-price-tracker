import express from "express";

const healthCheckApp = express.Router();

healthCheckApp.get(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const healthCheck = {
      uptime: process.uptime(),
      message: "OK",
      timestamp: Date.now(),
    };
    try {
      res.json(healthCheck);
    } catch (e: any) {
      res.status(500).send(e.message);
    }
  }
);

export default healthCheckApp;
