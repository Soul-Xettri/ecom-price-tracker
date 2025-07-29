import express from "express";
import Product from "../models/Product";
import { scrapeDarazProduct } from "../services/scraper";

const router = express.Router();

router.post("/", async (req, res) => {
  const { url, desiredPrice, userId } = req.body;

  const scraped = await scrapeDarazProduct(url);
  if (!scraped)
    return res.status(400).json({ error: "Failed to scrape product" });

  const product = await Product.create({
    url,
    title: scraped.title,
    currentPrice: scraped.price,
    desiredPrice,
    userId,
  });

  res.json(product);
});

router.get("/", async (_req, res) => {
  const products = await Product.find();
  res.json(products);
});

export default router;
