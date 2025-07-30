import express from "express";
import dotenv from "dotenv";
import "express-async-errors";
import { scrapeDarazProduct } from "./services/scraper";
import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/auth.route";
import discordRoutes from "./routes/discord.route";
import { checkProductPrices } from "./services/alert-checker";
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
app.use("/healthCheck", healthCheckApp);
app.use(errorHandlerMiddleware);
app.get("/test-scrape", async (_req, res) => {
  const testUrl =
    "https://www.daraz.com.np/products/unisex-boston-cotton-printed-t-shirt-men-women-i393696052-s1706727176.html?scm=1007.51610.379274.0&pvid=80b8128f-db6b-4e81-9e1d-745a8dd2fa56&search=flashsale&spm=a2a0e.tm80335409.FlashSale.d_393696052";
  const result = await scrapeDarazProduct(testUrl);
  res.json(result);
});

// setInterval(checkProductPrices, 5 * 60 * 1000);
// checkProductPrices();

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
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    server.close(() => {
      console.log("Server shut down due to MongoDB connection failure");
    });
  }
});
