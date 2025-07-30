import puppeteer from "puppeteer";
import BadRequestError from "../errors/BadRequestError";
import { Product } from "../models/Product";

class ProductService {
  static async scrapeProduct(
    userId: string,
    dto: {
      url: string;
      ecommercePlatform: "daraz" | "amazon" | "flipkart";
      desiredPrice: number;
    }
  ) {
    const { url, ecommercePlatform, desiredPrice } = dto;
    if (desiredPrice < 0) {
      throw new BadRequestError("Desired price cannot be negative");
    }

    const browser = await puppeteer.launch({ headless: true });

    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0");
    await page.goto(url, { waitUntil: "networkidle2" });
    let data;
    if (ecommercePlatform === "daraz") {
      data = await page.evaluate(() => {
        const title = document.title;

        const priceText =
          document.querySelector(".pdp-price_type_normal")?.textContent || "";
        const originalPriceText =
          document.querySelector(".pdp-price_type_deleted")?.textContent || "";
        const discountPrice =
          document.querySelector(".pdp-product-price__discount")?.textContent ||
          "";

        const imageUrls: string[] = [];
        document
          .querySelectorAll(".item-gallery__thumbnail-image")
          .forEach((img) => {
            const src = (img as HTMLImageElement).src;
            if (src) imageUrls.push(src);
          });

        const mainImageUrl: string[] = [];
        document
          .querySelectorAll(".gallery-preview-panel__image")
          .forEach((img) => {
            const src = (img as HTMLImageElement).src;
            if (src) mainImageUrl.push(src);
          });

        document.querySelectorAll(".detail-content img").forEach((img) => {
          const src = (img as HTMLImageElement).src;
          if (src) imageUrls.push(src);
        });

        return {
          title,
          price: parseFloat(priceText.replace(/[^\d]/g, "")) || null,
          originalPrice:
            parseFloat(originalPriceText.replace(/[^\d]/g, "")) || null,
          discountPrice: discountPrice.trim() || null,
          imageUrls,
          mainImageUrl,
        };
      });
    }
    await browser.close();
    if (!data) {
      throw new BadRequestError("Failed to scrape product data");
    }
    if (data.title === "Access Denied" || !data.title) {
      throw new BadRequestError(
        "Failed to scrape product data, access denied or product not found"
      );
    }
    const {
      title,
      price,
      originalPrice,
      discountPrice,
      imageUrls,
      mainImageUrl,
    } = data;
    if (desiredPrice && price !== null && price < desiredPrice) {
      throw new BadRequestError(
        `Current price ${price} is already less than desired price ${desiredPrice}.`
      );
    }
    const product = {
      userId,
      url,
      ecommercePlatform,
      title,
      currentPrice: price,
      originalPrice,
      discountPrice,
      imageUrls,
      desiredPrice,
      mainImageUrl,
    };
    const productModel = new Product(product);
    const savedProduct = await productModel.save();
    return savedProduct;
  }

  static async getProductsByUserId(userId: string) {
    const products = await Product.find({ userId }).sort({ createdAt: -1 });
    return products;
  }

  static async updateDesiredPrice(
    userId: string,
    productId: string,
    desiredPrice: number
  ) {
    const product = await Product.findOne({ _id: productId, userId });
    if (!product) {
      throw new BadRequestError("Product not found");
    }
    if (product.alertSent) {
      throw new BadRequestError(
        "Cannot update desired price for a product that has already sent an alert."
      );
    }
    if (desiredPrice < 0) {
      throw new BadRequestError("Desired price cannot be negative");
    }
    if (
      product.currentPrice !== null &&
      product.currentPrice !== undefined &&
      product.currentPrice < desiredPrice
    ) {
      throw new BadRequestError(
        `Current price ${product.currentPrice} is already less than desired price ${desiredPrice}.`
      );
    }
    product.desiredPrice = desiredPrice;
    await product.save();
    return product;
  }

  static async toggleProductStatus(userId: string, productId: string) {
    const product = await Product.findOne({ _id: productId, userId });
    if (!product) {
      throw new BadRequestError("Product not found");
    }
    if (!product.isActive && product.alertSent) {
      throw new BadRequestError(
        "Cannot activate a product that has already sent an alert."
      );
    }
    product.isActive = !product.isActive;
    await product.save();
    return {
      message: `${
        product.isActive
          ? "Product tracking activated successfully"
          : "Product tracking deactivated successfully"
      }`,
      product,
    };
  }
}

export default ProductService;
