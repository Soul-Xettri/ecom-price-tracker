// src/index.ts
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { scrapeDarazProduct } from "./services/scraper";
import productRoutes from "./routes/productRoutes";
import { checkProductPrices } from "./services/alert-checker";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/products", productRoutes);

app.get("/", (_req, res) => res.send("🛒 Ecom Price Tracker is running"));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.get("/test-scrape", async (_req, res) => {
  const testUrl =
    "https://www.daraz.com.np/products/unisex-boston-cotton-printed-t-shirt-men-women-i393696052-s1706727176.html?scm=1007.51610.379274.0&pvid=80b8128f-db6b-4e81-9e1d-745a8dd2fa56&search=flashsale&spm=a2a0e.tm80335409.FlashSale.d_393696052";
  const result = await scrapeDarazProduct(testUrl);
  res.json(result);
});

// setInterval(checkProductPrices, 5 * 60 * 1000);
checkProductPrices();