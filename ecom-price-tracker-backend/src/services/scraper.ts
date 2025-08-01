import puppeteer from "puppeteer";
export const scrapeDarazProduct = async (
  url: string,
  ecommercePlatform: string,
  zipCode: string = "10001"
) => {
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
        const discountElement = document.querySelector(
          ".x-additional-info__item--2"
        );
        if (discountElement && discountElement.textContent) {
          // Extract only the discount percentage (e.g., "34% off")
          const match = discountElement.textContent.match(/\d+% off/);
          discountPrice = match ? match[0] : discountElement.textContent.trim();
        }

        // Images
        const imageUrls: string[] = [];
        document.querySelectorAll(".ux-image-grid-item img").forEach((img) => {
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
    } else if (ecommercePlatform === "bestbuy") {
      // await page.goto(url, { waitUntil: "networkidle2" });
      await page.goto(url, { waitUntil: "domcontentloaded" });
      await page.waitForSelector(
        ".font-sans.text-default.text-style-body-md-400.font-500.text-7.leading-7",
        { timeout: 8000 }
      );

      data = await page.evaluate(() => {
        const title = document.title;

        // Flipkart price selectors
        let price = null;
        let currency;
        let priceDecimal = null;
        const priceSelectors = [
          ".font-sans.text-default.text-style-body-md-400.font-500.text-7.leading-7",
        ];

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
        // BestBuy original price selector
        const originalPriceSelectors = [
          '[data-testid="price-block-regular-price-message-text"]',
        ];

        for (const selector of originalPriceSelectors) {
          const originalElement = document.querySelector(selector);
          if (originalElement && originalElement.textContent) {
            // Extract price from text like "Comp. Value: $999.00"
            const match = originalElement.textContent.match(/\$([\d,.]+)/);
            if (match && match[1]) {
              const priceText = match[1].replace(/,/g, "");
              if (priceText.includes(".")) {
                const [beforeDecimal, afterDecimal] = priceText.split(".");
                originalPrice = parseFloat(beforeDecimal);
                originalPriceDecimal = afterDecimal;
              } else {
                originalPrice = parseFloat(priceText);
              }
              break;
            }
          }
        }

        // Discount
        let discountPrice = null;
        const discountSelectors = ['[data-testid="price-block-total-savings"]'];
        for (const discountSelector of discountSelectors) {
          const discountElement = document.querySelector(discountSelector);
          if (discountElement && discountElement.textContent) {
            // Only save if the discount text contains numbers
            if (/\d+/.test(discountElement.textContent)) {
              // Extract only the discount percentage (e.g., "34% off")
              const match = discountElement.textContent.match(/\d+% off/);
              discountPrice = match
                ? match[0]
                : discountElement.textContent.trim();
            }
          }
        }

        // Images
        const imageUrls: string[] = [];
        document
          .querySelectorAll(".pr-300.flex.flex-col.items-start img")
          .forEach((img) => {
            const src = (img as HTMLImageElement).src;
            if (src) imageUrls.push(src);
          });

        const mainImageUrl: string[] = [];
        const mainImg = document.querySelector(
          ".c-button-unstyled.flex.grow.shrink-none.basis-full img"
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
    } else if (ecommercePlatform === "wallmart") {
      // await page.goto(url, { waitUntil: "networkidle2" });
      await page.goto(url, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("[data-testid='price-wrap']", {
        timeout: 8000,
      });

      data = await page.evaluate(() => {
        const title = document.title;

        // Flipkart price selectors
        let price = null;
        let currency;
        let priceDecimal = null;
        const priceSelectors = ["[data-testid='price-wrap']"];

        for (const selector of priceSelectors) {
          const priceElement = document.querySelector(selector);
          if (priceElement && priceElement.textContent) {
            // Remove "Now" (case-insensitive) and any extra spaces before extracting price
            const cleanedText = priceElement.textContent
              .replace(/now\s*/i, "")
              .trim();
            const priceText = cleanedText.replace(/[^\d.]/g, "");
            if (priceText) {
              if (priceText.includes(".")) {
                const [beforeDecimal, afterDecimal] = priceText.split(".");
                price = parseFloat(beforeDecimal);
                priceDecimal = afterDecimal;
              } else {
                price = parseFloat(priceText);
              }
              // Extract only the currency from text like "US $94.95/ea"
              const currencyMatch = cleanedText.match(/[^\d\s.,/]+/g);
              currency = currencyMatch ? currencyMatch.join(" ") : "";
              break;
            }
          }
        }

        // Original price
        let originalPrice = null;
        let originalPriceDecimal = null;
        const originalPriceSelectors = ["[data-testid='strike-through-price']"];

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
        const discountSelectors = ["[data-testid='dollar-saving']"];
        for (const discountSelector of discountSelectors) {
          const discountElement = document.querySelector(discountSelector);
          if (discountElement && discountElement.textContent) {
            // Only save if the discount text contains numbers
            if (/\d+/.test(discountElement.textContent)) {
              // Extract only the discount percentage (e.g., "34% off")
              const match = discountElement.textContent.match(/\d+% off/);
              discountPrice = match
                ? match[0]
                : discountElement.textContent.trim();
            }
          }
        }

        // Images
        const imageUrls: string[] = [];
        document
          .querySelectorAll("[data-testid='vertical-carousel-container'] img")
          .forEach((img) => {
            const src = (img as HTMLImageElement).src;
            if (src) imageUrls.push(src);
          });

        const mainImageUrl: string[] = [];
        const mainImg = document.querySelector(
          "[data-testid='stack-item-dynamic-zoom-image-lazy'] img"
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
    } else if (ecommercePlatform === "amazon") {
      // 1. Go to home page to set ZIP
      await page.goto("https://www.amazon.com", {
        waitUntil: "domcontentloaded",
      });

      // 2. Set ZIP
      // Wait until location selector is available
      await page.waitForSelector("#nav-global-location-popover-link", {
        timeout: 100000, // 100 seconds
      });
      // Now click it
      await page.click("#nav-global-location-popover-link");
      await page.waitForSelector("#GLUXZipUpdateInput", { timeout: 80000 });
      await page.type("#GLUXZipUpdateInput", `${zipCode}`, { delay: 50 });
      await page.click("#GLUXZipUpdate");
      try {
        await page.waitForNavigation({
          waitUntil: "domcontentloaded",
          timeout: 8000,
        });
      } catch {
        await new Promise((res) => setTimeout(res, 4000)); // fallback
      }

      // 3. Now go to product
      await page.goto(url, { waitUntil: "domcontentloaded" });

      // If continue shopping button appears
      const continueBtn = await page.$(
        'button.a-button-text[alt="Continue shopping"]'
      );
      if (continueBtn) {
        console.log("Continue shopping button found, clicking it...");
        await continueBtn.click();
        await page.waitForNavigation({ waitUntil: "domcontentloaded" });
      }

      // 4. Wait for main price
      await page.waitForSelector("#corePrice_feature_div .a-offscreen", {
        timeout: 80000, // waiting time for price to load i.e 80 seconds
      });

      data = await page.evaluate(() => {
        const title = document.title;

        // Flipkart price selectors
        let price = null;
        let currency;
        let priceDecimal = null;
        const priceSelectors = [
          "#corePrice_feature_div .a-offscreen", // Regular price
          "#price_inside_buybox", // Alternative
          "#tp_price_block_total_price_ww", // Some special products
        ];

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
              currency = currencyMatch ? currencyMatch.join(" ") : "$";
              break;
            }
          }
        }

        // Original price
        let originalPrice = null;
        let originalPriceDecimal = null;
        const originalPriceSelectors = [
          ".a-price.a-text-price .a-offscreen", // Strike-through price
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
        const discountSelectors = [".savingsPercentage"];
        for (const discountSelector of discountSelectors) {
          const discountElement = document.querySelector(discountSelector);
          if (discountElement && discountElement.textContent) {
            // Only save if the discount text contains numbers
            if (/\d+/.test(discountElement.textContent)) {
              // Extract only the discount percentage (e.g., "34% off")
              const match = discountElement.textContent.match(/\d+% off/);
              discountPrice = match
                ? match[0]
                : discountElement.textContent.trim();
            }
          }
        }

        // Images
        const imageUrls: string[] = [];
        document.querySelectorAll("#altImages img").forEach((img) => {
          const src = (img as HTMLImageElement).src;
          if (src) imageUrls.push(src);
        });

        const mainImageUrl: string[] = [];
        const mainImg = document.querySelector(
          "#imgTagWrapperId  img"
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
    console.error(
      `Failed to scrape ${ecommercePlatform}: ${(error as Error).message}`
    );
  }

  await browser.close();

  if (!data) {
    console.error(
      `No data scraped from ${ecommercePlatform}. Please check the URL or the page structure.`
    );
    return null;
  }

  if (
    data.title === "Access Denied" ||
    !data.title ||
    data.title.includes("Page Not Found")
  ) {
    console.error(
      `Failed to scrape product data from ${ecommercePlatform}. The page may not exist or
      the structure may have changed.`
    );
    return null;
  }

  return data;
};
