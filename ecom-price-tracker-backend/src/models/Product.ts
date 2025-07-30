import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    url: String,
    ecommercePlatform: {
      type: String,
      enum: ["daraz", "amazon", "flipkart"],
      default: "daraz",
    },
    title: String,
    originalPrice: Number,
    discountPrice: String,
    currentPrice: Number,
    desiredPrice: Number,
    imageUrls: [String],
    mainImageUrl: [String],
    alertSent: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
