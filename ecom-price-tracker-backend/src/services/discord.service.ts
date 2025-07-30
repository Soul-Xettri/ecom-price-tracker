import BadRequestError from "../errors/BadRequestError";
import DataNotFoundError from "../errors/DataNotFoundError";
import { DiscordServer } from "../models/DiscordServer";
import { User } from "../models/User";
import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

class DiscordService {
  static async saveServer(
    userId: string,
    dto: {
      ownerId: string;
      serverId: string;
      serverName: string;
      serverIcon: string | null;
    }
  ) {
    const { ownerId, serverId, serverName, serverIcon } = dto;

    const user = await User.findById(userId);
    if (!user) {
      throw new DataNotFoundError("User not found");
    }

    if (user.discordId !== ownerId) {
      throw new BadRequestError(
        "Owner ID does not match the user's Discord ID"
      );
    }

    const existingServer = await DiscordServer.findOne({ serverId });
    if (existingServer) {
      throw new BadRequestError("Server with this ID already exists");
    }

    const newServer = new DiscordServer({
      ownerId,
      userId,
      serverId,
      serverName,
      serverIcon,
    });
    await newServer.save();
    return newServer;
  }

  static async fetchServersByUserId(userId: string) {
    const servers = await DiscordServer.find({ userId });
    return servers;
  }

  static async fetchServerById(userId: string, serverId: string) {
    const server = await DiscordServer.findOne({ serverId, userId });
    if (!server) {
      throw new DataNotFoundError("Discord server not found");
    }
    return server;
  }

  static async updateServer(
    serverId: string,
    dto: {
      channelId?: string;
      channelName?: string;
      botAlertStatus?: boolean;
    }
  ) {
    const server = await DiscordServer.findById(serverId);
    if (!server) {
      throw new DataNotFoundError("Discord server not found");
    }
    client.login(process.env.DISCORD_BOT_TOKEN);
    if (!client.isReady()) {
      throw new BadRequestError("Discord client is not ready");
    }
    const guild = await client.guilds.fetch(server.serverId);
    if (!guild) throw new DataNotFoundError("Discord server not found");

    if (!guild.available) {
      throw new BadRequestError("Discord server is not available");
    }

    // Check if new channel ID is provided which is different from the current one
    if (dto.channelId && dto.channelId !== server.channelId) {
      const channel = await guild.channels.fetch(dto.channelId);
      if (!channel) throw new DataNotFoundError("Discord channel not found");
      if (!channel.isTextBased()) {
        throw new BadRequestError("Channel must be a text channel");
      }
      const permissions = channel.permissionsFor(client.user?.id || "");
      if (!permissions || !permissions.has("SendMessages")) {
        throw new BadRequestError(
          "Bot lacks permission to send messages in this channel"
        );
      }
      if (dto.botAlertStatus || server.botAlertStatus) {
        await channel.send(
          `Bot has been set up to send alerts in this channel.`
        );
      }
    }

    if (dto.channelId && dto.channelId === server.channelId) {
      const channel = await guild.channels.fetch(dto.channelId);
      if (!channel) throw new DataNotFoundError("Discord channel not found");
      if (!channel.isTextBased()) {
        throw new BadRequestError("Channel must be a text channel");
      }
      const permissions = channel.permissionsFor(client.user?.id || "");
      if (!permissions || !permissions.has("SendMessages")) {
        throw new BadRequestError(
          "Bot lacks permission to send messages in this channel"
        );
      }
      if (dto.botAlertStatus && !server.botAlertStatus) {
        await channel.send("✅ Bot alerts enabled in this channel!");
      } else if (!dto.botAlertStatus && server.botAlertStatus) {
        await channel.send("❌ Bot alerts disabled in this channel!");
      }
    }
    server.channelId = dto.channelId || server.channelId;

    server.channelName = dto.channelName || server.channelName;

    server.botAlertStatus =
      dto.botAlertStatus !== undefined
        ? dto.botAlertStatus
        : server.botAlertStatus;

    await server.save();
    return server;
  }

  static async deleteServer(userId: string, serverId: string) {
    const server = await DiscordServer.findOneAndDelete({
      _id: serverId,
      userId,
    });
    if (!server) {
      throw new DataNotFoundError("Discord server not found");
    }
    return server;
  }
}

export default DiscordService;
