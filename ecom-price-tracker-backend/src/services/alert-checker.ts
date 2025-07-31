import { scrapeDarazProduct } from "./scraper";
import { sendDiscordAlert } from "../bot/discordBot";
import { User } from "../models/User";
import { DiscordServer } from "../models/DiscordServer";
import { Product } from "../models/Product";

export const checkProductPrices = async (userId: string) => {
  console.log("🔁 Checking product prices...");

  const user = await User.findById(userId);
  if (!user) {
    console.error(`❌ User with ID ${userId} not found.`);
    return;
  }

  console.log(`🔍 Fetching Discord servers for user: ${userId}`);

  const discordServers = await DiscordServer.find({
    userId: user._id,
    botAlertStatus: true,
    channelId: { $exists: true, $ne: "" },
  });

  console.log(
    `🔍 Found ${discordServers.length} Discord servers with active bot alerts.`
  );

  if (discordServers.length === 0) {
    console.log("ℹ️ No Discord servers with active bot alerts and channels.");
    return;
  }

  const trackedProducts = await Product.find({
    userId: user._id,
    alertSent: false,
    isActive: true,
  });

  if (trackedProducts.length === 0) {
    console.log("ℹ️ No active tracked products for this user.");
    return;
  }

  for (const product of trackedProducts) {
    try {
      console.log(`🔎 Checking product: ${product.title}`);

      if (!product.url) {
        console.warn(`⚠️ Product ${product.title} has no URL, skipping.`);
        continue;
      }

      const scraped = await scrapeDarazProduct(
        product.url,
        product.ecommercePlatform
      );
      if (!scraped) {
        console.warn(`⚠️ Failed to scrape ${product.title}, skipping.`);
        continue;
      }

      const { price } = scraped;
      const desiredPrice = product.desiredPrice;

      if (!price || isNaN(price)) {
        console.warn(
          `⚠️ Invalid price scraped for ${product.title}, skipping.`
        );
        continue;
      }

      if (!desiredPrice || isNaN(desiredPrice)) {
        console.warn(
          `⚠️ Invalid desired price for ${product.title}, skipping.`
        );
        continue;
      }

      if (price < desiredPrice && !product.alertSent) {
        console.log(
          `✅ Price drop detected for ${product.title}: Rs. ${price} (Desired: Rs. ${desiredPrice})`
        );

        for (const server of discordServers) {
          try {
            await sendDiscordAlert(
              product.title ?? "Unknown Product",
              price,
              product.url,
              server.channelId ?? "",
              user._id.toString(),
              user.email ?? "",
              user.name ?? "Unknown User",
              product.originalPrice ?? 0,
              product.desiredPrice ?? 0,
              product.currency ?? "Rs.",
              product.ecommercePlatform ?? "daraz",
              product.mainImageUrl[0] ?? "",
              product.discountPrice ?? ""
            );
            server.alertCount += 1;
            await server.save();
          } catch (sendErr) {
            console.error(
              `❌ Failed to send alert to server ${server.serverName}:`,
              sendErr
            );
          }
        }

        product.alertSent = true;
        product.isActive = false;
        product.currentPrice = price;

        console.log(`✅ Alert sent for ${product.title}`);
      } else {
        console.log(`ℹ️ ${product.title} still above desired price.`);
        product.currentPrice = price;
      }

      await product.save();

      // Optional throttle (to reduce scraping bans)
      // await new Promise((res) => setTimeout(res, 500));
    } catch (err) {
      console.error(`❌ Failed to check product: ${product.title}`, err);
      continue;
    }
  }
};
