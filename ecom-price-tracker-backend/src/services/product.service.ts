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

    console.log("dto:", dto);

    console.log("Starting product scrape for URL:", url);
    console.log("E-commerce Platform:", ecommercePlatform);
    console.log("Desired Price:", desiredPrice);

    const browser = await puppeteer.launch({ headless: true });

    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0");
    await page.goto(url, { waitUntil: "networkidle2" });
    console.log("Scraping product data...");
    let data;
    if (ecommercePlatform === "daraz") {
      console.log("Scraping Daraz product...");
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
}

export default ProductService;
