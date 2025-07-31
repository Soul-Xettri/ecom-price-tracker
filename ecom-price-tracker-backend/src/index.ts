import express from "express";
import dotenv from "dotenv";
import "express-async-errors";
import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/auth.route";
import settingRoutes from "./routes/setting.route";
import discordRoutes from "./routes/discord.route";
import alertsRoutes from "./routes/alerts.route";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import ruid from "express-ruid";
import healthCheckApp from "./utils/healthcheck";
import { errorHandlerMiddleware } from "./handler";
import mongoConnection from "./config/dbconnection";
import morgan from "morgan";
import requestIp from "request-ip";
import authMiddleware from "./middleware/authMiddleware";
import cronJob from "./scripts/cronjob";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

morgan.token("ip", function (req: express.Request) {
  const ip = requestIp.getClientIp(req);
  return ip === null ? undefined : ip;
});

app.use(
  morgan(":ip - :method :url :status :response-time ms - :res[content-length]")
);

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(ruid({}));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/discord", authMiddleware, discordRoutes);
app.use("/api/v1/product", authMiddleware, productRoutes);
app.use("/api/v1/settings", authMiddleware, settingRoutes);
app.use("/api/v1/alerts", authMiddleware, alertsRoutes);
app.use("/healthCheck", healthCheckApp);
app.use(errorHandlerMiddleware);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    data: {
      message: `cannot find ${req.originalUrl}  on this server`,
    },
  });
});

const server = app.listen(PORT, async () => {
  try {
    console.log(`Running on ${process.env.NODE_ENV} server`);
    await mongoConnection();
    console.log(`Server started at port ${PORT} and MongoDB connected`);
    await cronJob.start();
    console.log("Cron job started successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    server.close(() => {
      console.log("Server shut down due to MongoDB connection failure");
    });
  }
});
