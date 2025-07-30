import express from "express";
import { scrapeProductDto } from "../dto/product.dto";
import handleValidationErrors from "../middleware/handleValidationErrors";
import ProductController from "../controllers/product.controller";
const router = express.Router();

router.post(
  "/",
  scrapeProductDto,
  handleValidationErrors(),
  ProductController.scrapeProduct
);

router.get("/", ProductController.getProductsByUserId);

export default router;
