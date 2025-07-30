import mongoose from "mongoose";

const discordServerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    ownerId: {
      type: String,
      required: true,
    },
    serverId: {
      type: String,
      required: true,
    },
    serverName: {
      type: String,
      required: true,
    },
    serverIcon: {
      type: String,
      required: false,
    },
    channelId: {
      type: String,
      required: false,
    },
    channelName: {
      type: String,
      required: false,
    },
    botAlertStatus: {
      type: Boolean,
      default: false,
    },
    alertCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const DiscordServer = mongoose.model(
  "DiscordServer",
  discordServerSchema
);
