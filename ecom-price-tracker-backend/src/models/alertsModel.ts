import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
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
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: false,
    },
    desiredPrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: String,
      required: false,
    },
    productUrl: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    ecommercePlatform: {
      type: String,
      required: false,
    },
    discordAlert: {
      type: Boolean,
      default: true,
    },
    emailAlert: {
      type: Boolean,
      default: false,
    },
    currency: {
      type: String,
      default: "$",
    },
  },
  {
    timestamps: true,
  }
);

export const Alert = mongoose.model("Alert", alertSchema);
