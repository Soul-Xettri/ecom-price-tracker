import asyncWrapper from "../middleware/catchAsyncErrors";
import ProductService from "../services/product.service";

const ProductController = {
  scrapeProduct: asyncWrapper(async (req, res) => {
    const dto = req.body;
    const userId = req.user.id;
    const product = await ProductService.scrapeProduct(userId, dto);
    return res.status(201).json({
      status: "success",
      data: {
        message: "Product scraped successfully",
        product: product,
      },
    });
  }),

  getProductsByUserId: asyncWrapper(async (req, res) => {
    const userId = req.user.id;
    const products = await ProductService.getProductsByUserId(userId);
    return res.status(200).json({
      status: "success",
      data: {
        message: "Products fetched successfully",
        products: products,
      },
    });
  }),
};

export default ProductController;