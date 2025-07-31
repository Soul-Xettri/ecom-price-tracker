import puppeteer from "puppeteer";
import BadRequestError from "../errors/BadRequestError";
import { Product } from "../models/Product";

class ProductService {
  static async scrapeProduct(
    userId: string,
    dto: {
      url: string;
      ecommercePlatform: "daraz" | "ebay" | "flipkart";
      desiredPrice: number;
    }
  ) {
    const { url, ecommercePlatform, desiredPrice } = dto;
    if (desiredPrice < 0) {
      throw new BadRequestError("Desired price cannot be negative");
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    let data;

    try {
      if (ecommercePlatform === "daraz") {
        // await page.goto(url, { waitUntil: "networkidle2" });
        await page.goto(url, { waitUntil: "domcontentloaded" });
        await page.waitForSelector(".pdp-price_type_normal", { timeout: 8000 });
        data = await page.evaluate(() => {
          const title = document.title;

          const priceText =
            document.querySelector(".pdp-price_type_normal")?.textContent || "";
          const originalPriceText =
            document.querySelector(".pdp-price_type_deleted")?.textContent ||
            "";
          const discountPrice =
            document.querySelector(".pdp-product-price__discount")
              ?.textContent || "";

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
            priceDecimal: null,
            currency: priceText.replace(/[\d,]/g, "").trim() || "Rs",
            originalPrice:
              parseFloat(originalPriceText.replace(/[^\d]/g, "")) || null,
            originalPriceDecimal: null,
            discountPrice: discountPrice.trim() || null,
            imageUrls,
            mainImageUrl,
          };
        });
      } else if (ecommercePlatform === "ebay") {
        // await page.goto(url, { waitUntil: "networkidle2" });
        await page.goto(url, { waitUntil: "domcontentloaded" });
        await page.waitForSelector(".x-price-primary", { timeout: 8000 });

        data = await page.evaluate(() => {
          const title = document.title;

          // Flipkart price selectors
          let price = null;
          let currency;
          let priceDecimal = null;
          const priceSelectors = [".x-price-primary"];

          for (const selector of priceSelectors) {
            const priceElement = document.querySelector(selector);
            if (priceElement && priceElement.textContent) {
              const priceText = priceElement.textContent.replace(/[^\d.]/g, "");
              if (priceText) {
                if (priceText.includes(".")) {
                  const [beforeDecimal, afterDecimal] = priceText.split(".");
                  price = parseFloat(beforeDecimal);
                  priceDecimal = afterDecimal;
                } else {
                  price = parseFloat(priceText);
                }
                // Extract only the currency from text like "US $94.95/ea"
                const currencyMatch =
                  priceElement.textContent.match(/[^\d\s.,/]+/g);
                currency = currencyMatch ? currencyMatch.join(" ") : "";
                break;
              }
            }
          }

          // Original price
          let originalPrice = null;
          let originalPriceDecimal = null;
          const originalPriceSelectors = [
            ".ux-textspans.ux-textspans--STRIKETHROUGH",
          ];

          for (const selector of originalPriceSelectors) {
            const originalElement = document.querySelector(selector);
            if (originalElement && originalElement.textContent) {
              const originalText = originalElement.textContent.replace(
                /[^\d.]/g,
                ""
              );
              if (originalText) {
                if (originalText.includes(".")) {
                  const [beforeDecimal, afterDecimal] = originalText.split(".");
                  originalPrice = parseFloat(beforeDecimal);
                  originalPriceDecimal = afterDecimal;
                } else {
                  originalPrice = parseFloat(originalText);
                }
                break;
              }
            }
          }

          // Discount
          let discountPrice = null;
          const discountSelectors = [
            ".x-additional-info__item--2",
            ".ux-textspans.ux-textspans--EMPHASIS",
          ];
          for (const discountSelector of discountSelectors) {
            const discountElement = document.querySelector(discountSelector);
            if (discountElement && discountElement.textContent) {
              // Extract only the discount percentage (e.g., "34% off")
              const match = discountElement.textContent.match(/\d+% off/);
              discountPrice = match
                ? match[0]
                : discountElement.textContent.trim();
            }
          }

          // Images
          const imageUrls: string[] = [];
          document
            .querySelectorAll(".ux-image-grid-item img")
            .forEach((img) => {
              const src = (img as HTMLImageElement).src;
              if (src) imageUrls.push(src);
            });

          const mainImageUrl: string[] = [];
          const mainImg = document.querySelector(
            ".ux-image-carousel-item.image-treatment img"
          ) as HTMLImageElement | null;
          if (mainImg && mainImg.src) {
            mainImageUrl.push(mainImg.src);
          }

          return {
            title,
            price,
            priceDecimal,
            currency,
            originalPrice,
            originalPriceDecimal,
            discountPrice,
            imageUrls,
            mainImageUrl,
          };
        });
      } else if (ecommercePlatform === "flipkart") {
        // await page.goto(url, { waitUntil: "networkidle2" });
        await page.goto(url, { waitUntil: "domcontentloaded" });
        await page.waitForSelector(".Nx9bqj.CxhGGd", { timeout: 8000 });

        data = await page.evaluate(() => {
          const title = document.title;

          // Flipkart price selectors
          let price = null;
          let priceDecimal = null;
          let currency;
          const priceSelectors = [".Nx9bqj.CxhGGd"];

          for (const selector of priceSelectors) {
            const priceElement = document.querySelector(selector);
            if (priceElement && priceElement.textContent) {
              const priceText = priceElement.textContent.replace(/[^\d.]/g, "");
              if (priceText) {
                if (priceText.includes(".")) {
                  const [beforeDecimal, afterDecimal] = priceText.split(".");
                  price = parseFloat(beforeDecimal);
                  priceDecimal = afterDecimal;
                } else {
                  price = parseFloat(priceText);
                }
                // Extract only the currency from text like "US $94.95/ea"
                const currencyMatch =
                  priceElement.textContent.match(/[^\d\s.,/]+/g);
                currency = currencyMatch ? currencyMatch.join(" ") : "";
                break;
              }
            }
          }

          // Original price
          let originalPrice = null;
          let originalPriceDecimal = null;
          const originalPriceSelectors = [".yRaY8j"];

          for (const selector of originalPriceSelectors) {
            const originalElement = document.querySelector(selector);
            if (originalElement && originalElement.textContent) {
              const originalText = originalElement.textContent.replace(
                /[^\d.]/g,
                ""
              );
              if (originalText) {
                if (originalText.includes(".")) {
                  const [beforeDecimal, afterDecimal] = originalText.split(".");
                  originalPrice = parseFloat(beforeDecimal);
                  originalPriceDecimal = afterDecimal;
                } else {
                  originalPrice = parseFloat(originalText);
                }
                break;
              }
            }
          }

          // Discount
          let discountPrice = null;
          const discountElement = document.querySelector(".UkUFwK.WW8yVX");
          if (discountElement && discountElement.textContent) {
            discountPrice = discountElement.textContent.trim();
          }

          // Images
          const imageUrls: string[] = [];
          document.querySelectorAll("._0DkuPH").forEach((img) => {
            const src = (img as HTMLImageElement).src;
            if (src) imageUrls.push(src);
          });

          const mainImageUrl: string[] = [];
          const mainImg = document.querySelector(
            ".DByuf4.IZexXJ.jLEJ7H"
          ) as HTMLImageElement | null;
          if (mainImg && mainImg.src) {
            mainImageUrl.push(mainImg.src);
          }

          return {
            title,
            price,
            priceDecimal,
            currency,
            originalPrice,
            originalPriceDecimal,
            discountPrice,
            imageUrls,
            mainImageUrl,
          };
        });
      }
    } catch (error) {
      await browser.close();
      throw new BadRequestError(
        `Failed to scrape ${ecommercePlatform}: ${(error as Error).message}`
      );
    }

    await browser.close();

    if (!data) {
      throw new BadRequestError("Failed to scrape product data");
    }

    if (
      data.title === "Access Denied" ||
      !data.title ||
      data.title.includes("Page Not Found")
    ) {
      throw new BadRequestError(
        "Failed to scrape product data, access denied or product not found"
      );
    }

    const {
      title,
      price,
      priceDecimal,
      currency,
      originalPrice,
      originalPriceDecimal,
      discountPrice,
      imageUrls,
      mainImageUrl,
    } = data;

    if (price === null || price === 0) {
      throw new BadRequestError(
        "Could not extract valid price from the product page"
      );
    }

    if (desiredPrice && price !== null && price <= desiredPrice) {
      throw new BadRequestError(
        `Current price ${price} is already less than or equal to desired price ${desiredPrice}.`
      );
    }

    const product = {
      userId,
      url,
      ecommercePlatform,
      title,
      currentPrice: price,
      currentDecimal: priceDecimal,
      originalPrice: originalPrice ? originalPrice : price,
      originalDecimal: originalPriceDecimal
        ? originalPriceDecimal
        : priceDecimal,
      discountPrice,
      imageUrls,
      desiredPrice,
      mainImageUrl,
      currency: currency || "Rs",
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
