// // src/services/scraper.ts
// import axios from "axios";
// import * as cheerio from "cheerio";

// export const scrapeDarazProduct = async (url: string) => {
//   try {
//     const { data } = await axios.get(url, {
//       headers: {
//         "User-Agent": "Mozilla/5.0",
//       },
//     });

//     const $ = cheerio.load(data);
//     // Extract product images from gallery thumbnails
//     const imageUrls: string[] = [];
//     $(".item-gallery__thumbnail-image").each((_, el) => {
//       const src = $(el).attr("src");
//       if (src) imageUrls.push(src);
//     });

//     // Extract product images from description section
//     $(".detail-content img").each((_, el) => {
//       const src = $(el).attr("src");
//       if (src) imageUrls.push(src);
//     });

//     const title = $("title").text().trim();

//     const priceText =
//       $(".pdp-price_type_normal")
//         .first()
//         .text()
//         .replace(/[^\d.]/g, "") ||
//       $(".pdp-price")
//         .first()
//         .text()
//         .replace(/[^\d.]/g, "");

//     const originalPriceText = $(".pdp-product-price .pdp-price_type_deleted")
//       .first()
//       .text()
//       .replace(/[^\d.]/g, "");

//     const price = priceText ? parseFloat(priceText) : null;
//     const originalPrice = originalPriceText
//       ? parseFloat(originalPriceText)
//       : null;

//     return { title, price, originalPrice, imageUrls };
//   } catch (err) {
//     console.error("❌ Failed to scrape:", err);
//     return null;
//   }
// };

// using Puppeteer for better handling of dynamic content
import puppeteer from "puppeteer";

export const scrapeDarazProduct = async (url: string) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setUserAgent("Mozilla/5.0");
    await page.goto(url, { waitUntil: "networkidle2" });

    const data = await page.evaluate(() => {
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
      };
    });

    await browser.close();
    return data;
  } catch (err) {
    console.error("❌ Failed to scrape:", err);
    return null;
  }
};
