import express from "express";
import {
  scrapeProductDto,
  updateDesiredPriceDto,
  updateProductStatusDto,
} from "../dto/product.dto";
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

router.patch(
  "/:productId/desired-price",
  updateDesiredPriceDto,
  handleValidationErrors(),
  ProductController.updateDesiredPrice
);

router.patch(
  "/:productId/status",
  updateProductStatusDto,
  handleValidationErrors(),
  ProductController.toggleProductStatus
);

export default router;
