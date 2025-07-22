// // Compares price & sends alert
// // src/services/alert-checker.ts
// import Product from "../models/Product";
// import { scrapeDarazProduct } from "./scraper";
// import { sendDiscordAlert } from "../bot/discordBot"; // placeholder function

// export const checkProductPrices = async () => {
//   console.log("🔁 Checking product prices...");
//   const products = await Product.find({ alertSent: false });

//   for (const product of products) {
//     try {
//       console.log(`Checking product: ${product.title}`);
//       if (!product.url) {
//         console.warn(`Product ${product.title} has no URL, skipping.`);
//         continue;
//       }
//       const scraped = await scrapeDarazProduct(product.url);
//       if (!scraped) continue;

//       const { price } = scraped;

//       const numericPrice = price !== null ? Number(price) : null;
//       const desiredPrice = product.desiredPrice;

//       if (
//         numericPrice !== null &&
//         !isNaN(numericPrice) &&
//         desiredPrice !== null &&
//         desiredPrice !== undefined &&
//         numericPrice <= desiredPrice
//       ) {
//         // Send alert
//         await sendDiscordAlert(
//           product.title ?? "Unknown Product",
//           numericPrice,
//           product.url
//         );

//         // Mark as alert sent
//         product.alertSent = true;
//         product.currentPrice = numericPrice;
//         await product.save();

//         console.log(`✅ Alert sent for ${product.title}`);
//       } else {
//         console.log(`ℹ️ ${product.title} still above desired price.`);
//         product.currentPrice = numericPrice;
//         await product.save();
//       }
//     } catch (err) {
//       console.error(`❌ Failed to check product: ${product.title}`, err);
//     }
//   }
// };

// src/services/alert-checker.ts
import { scrapeDarazProduct } from "./scraper";
import { sendDiscordAlert } from "../bot/discordBot";

const hardcodedProducts = [
  {
    title:
      "White Fashionable Women's Sport Running Shoes | Sneaker - 181 | Daraz.com.np",
    url: "https://www.daraz.com.np/products/bf-dearhill-white-fashionable-sports-running-shoes-bf-sports-shoes-for-women-bf-181-i150591514-s1106559548.html?scm=1007.51610.379274.0&pvid=a51418d5-3307-4579-936a-d96ee5096459&search=flashsale&spm=a2a0e.tm80335409.FlashSale.d_150591514", // use real product
    desiredPrice: 1099,
    alertSent: false,
    currentPrice: null as number | null,
  },
  {
    title:
      "Unisex BOSTON COTTON PRINTED T-SHIRT ( Men & Women ) | Daraz.com.np",
    url: "https://www.daraz.com.np/products/unisex-boston-cotton-printed-t-shirt-men-women-i393696052-s1706727176.html?scm=1007.51610.379274.0&pvid=80b8128f-db6b-4e81-9e1d-745a8dd2fa56&search=flashsale&spm=a2a0e.tm80335409.FlashSale.d_393696052", // use real product
    desiredPrice: 398,
    alertSent: false,
    currentPrice: null as number | null,
  },
];

export const checkProductPrices = async () => {
  console.log("🔁 Checking product prices...");

  for (const product of hardcodedProducts) {
    try {
      console.log(`Checking product: ${product.title}`);
      if (!product.url) {
        console.warn(`Product ${product.title} has no URL, skipping.`);
        continue;
      }

      const scraped = await scrapeDarazProduct(product.url);
      if (!scraped) continue;
      const { price } = scraped;
      const numericPrice = price !== null ? Number(price) : null;
      const desiredPrice = product.desiredPrice;

      if (
        numericPrice !== null &&
        !isNaN(numericPrice) &&
        desiredPrice !== null &&
        numericPrice <= desiredPrice &&
        !product.alertSent
      ) {
        await sendDiscordAlert(product.title, numericPrice, product.url);

        product.alertSent = true;
        product.currentPrice =
          typeof numericPrice === "number" && !isNaN(numericPrice)
            ? numericPrice
            : 0;

        console.log(`✅ Alert sent for ${product.title}`);
      } else {
        console.log(`ℹ️ ${product.title} still above desired price.`);
        product.currentPrice =
          typeof numericPrice === "number" && !isNaN(numericPrice)
            ? numericPrice
            : 0;
      }
    } catch (err) {
      console.error(`❌ Failed to check product: ${product.title}`, err);
    }
  }
};
