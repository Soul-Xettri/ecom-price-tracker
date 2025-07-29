import mongoose from "mongoose";

const serverLogSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: false,
    },
    businessUsername: {
      type: String,
      required: false,
    },
    additionalInfo: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
    userId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const ServerLog = mongoose.model("ServerLog", serverLogSchema);
