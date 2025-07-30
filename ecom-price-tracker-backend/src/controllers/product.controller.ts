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

  updateDesiredPrice: asyncWrapper(async (req, res) => {
    const userId = req.user.id;
    const productId = req.params.productId;
    const desiredPrice = req.body.desiredPrice;
    const updatedProduct = await ProductService.updateDesiredPrice(
      userId,
      productId,
      desiredPrice
    );
    return res.status(200).json({
      status: "success",
      data: {
        message: "Desired price updated successfully",
        product: updatedProduct,
      },
    });
  }),

  toggleProductStatus: asyncWrapper(async (req, res) => {
    const userId = req.user.id;
    const productId = req.params.productId;
    const updatedProduct = await ProductService.toggleProductStatus(
      userId,
      productId
    );
    return res.status(200).json({
      status: "success",
      data: {
        message: updatedProduct.message,
        product: updatedProduct.product,
      },
    });
  }),
};

export default ProductController;
