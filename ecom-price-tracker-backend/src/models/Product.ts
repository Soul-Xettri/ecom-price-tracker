// Mongoose schema

// src/models/Product.ts
import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  url: String,
  title: String,
  currentPrice: Number,
  desiredPrice: Number,
  alertSent: { type: Boolean, default: false },
  userId: String, // discord user id or channel id
});

export default model('Product', productSchema);
