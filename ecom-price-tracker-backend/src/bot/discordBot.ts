import {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  TextChannel,
  NewsChannel,
} from "discord.js";
import dotenv from "dotenv";
import { Alert } from "../models/alertsModel";
import { Setting } from "../models/settings";
import MailService from "../mail/mail.service";
dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once("ready", () => {
  console.log(`🤖 Discord bot ready as ${client.user?.tag} on bot service`);
});

client.login(process.env.DISCORD_BOT_TOKEN);

// Enhanced Message Sender with Embed
export const sendDiscordAlert = async (
  title: string,
  price: number,
  url: string,
  channelId: string,
  userId: string,
  email: string,
  username: string,
  originalPrice: number,
  desiredPrice: number,
  currency: string,
  ecommercePlatform: string,
  imageUrl?: string,
  discount?: string
) => {
  if (!channelId) {
    console.error("❌ Channel ID is required to send a Discord alert.");
    return;
  }

  try {
    const settings = await Setting.findOne({ userId });

    const channel = await client.channels.fetch(channelId);

    if (
      channel &&
      (channel.type === 0 || channel.type === 5) // 0: TextChannel, 5: NewsChannel
    ) {
      const embed = new EmbedBuilder()
        .setTitle("📉 Price Drop Alert!")
        .setDescription(
          `[${title}](${url}) is now available at **Rs. ${price}**`
        )
        .setColor(0x00cc66)
        .addFields(
          originalPrice && originalPrice > price
            ? {
                name: "Original Price",
                value: `~~${currency} ${originalPrice}~~`,
                inline: true,
              }
            : { name: "Original Price", value: "N/A", inline: true },
          {
            name: "Current Price",
            value: `${currency} ${price}`,
            inline: true,
          },
          {
            name: "Desired Price",
            value: `${currency} ${desiredPrice}`,
            inline: true,
          },
          discount
            ? { name: "Discount", value: `${discount}`, inline: true }
            : { name: "\u200B", value: "\u200B", inline: true },
          ecommercePlatform
            ? { name: "Platform", value: ecommercePlatform, inline: true }
            : { name: "\u200B", value: "\u200B", inline: true }
        )
        .setTimestamp()
        .setFooter({ text: "Price Tracker Bot" });

      if (imageUrl) {
        embed.setThumbnail(imageUrl);
      }

      await (channel as TextChannel | NewsChannel).send({ embeds: [embed] });

      if (settings?.emailAlert) {
        let savings = null;
        if (originalPrice && originalPrice > price) {
          const savingsAmount = originalPrice - price;
          const savingsPercentage = (
            (savingsAmount / originalPrice) *
            100
          ).toFixed(1);
          savings = {
            amount: savingsAmount,
            percentage: savingsPercentage,
          };
        }
        try {
          await MailService.sendProductPriceDropAlert(
            title,
            price,
            url,
            email,
            username,
            originalPrice,
            desiredPrice,
            currency,
            ecommercePlatform,
            savings,
            imageUrl,
            discount,
          );
        } catch (error) {
          settings.emailAlert = false; // Disable email alerts on error
          console.error("❌ Failed to send email alert:", error);
          // Do not end the process; just log the error and continue
        }
      }

      await Alert.create({
        userId,
        serverId: channel.guild.id,
        serverName: channel.guild.name,
        serverIcon: channel.guild.iconURL() || "",
        channelId: channel.id,
        channelName: channel.name,
        title,
        price,
        originalPrice,
        desiredPrice,
        currency,
        discount,
        productUrl: url,
        imageUrl,
        ecommercePlatform,
        emailAlert: settings?.emailAlert || false,
      });
    }
  } catch (err) {
    console.error(
      `❌ Failed to send alert to Discord channel ${channelId}`,
      err
    );
  }
};
