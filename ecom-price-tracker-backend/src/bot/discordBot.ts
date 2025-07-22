// Discord bot logic
// src/bot/discordBot.ts
import { channel } from "diagnostics_channel";
import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once("ready", () => {
  console.log(`🤖 Discord bot ready as ${client.user?.tag}`);
});

client.login(process.env.DISCORD_BOT_TOKEN);

// Message Sender
export const sendDiscordAlert = async (
  title: string,
  price: number,
  url: string
) => {
  if (!process.env.ALERT_CHANNEL_ID) {
    throw new Error("ALERT_CHANNEL_ID is not defined in environment variables.");
  }
  console.log("channel id", process.env.ALERT_CHANNEL_ID);
  const channel = await client.channels.fetch(process.env.ALERT_CHANNEL_ID as string);
  console.log("channel", channel);
  if (
    channel &&
    (channel.type === 0 || channel.type === 5) // 0: TextChannel, 5: NewsChannel
  ) {
    await (
      channel as
        | import("discord.js").TextChannel
        | import("discord.js").NewsChannel
    ).send(
      `📢 **Price Drop Alert!**\n**${title}** is now **Rs. ${price}**\n🔗 ${url}`
    );
  }
};
