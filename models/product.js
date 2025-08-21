/**
 * Product.js
 *
 * Purpose:
 *   Defines the Mongoose schema and model for "Product" documents in MongoDB.
 *   A Product represents an item in the inventory with fields for name, category, price, and quantity.
 *   Other files can import { Product } and use it to query or update the database
 *   (e.g., Product.find(), Product.create(), Product.findByIdAndUpdate()).
 *
 * Schema Fields:
 *   - name:     String, required, trimmed
 *   - category: String, required, stored lowercase, trimmed (for case-insensitive filtering)
 *   - price:    Number, required, minimum 0 (no negative prices)
 *   - quantity: Number, required, minimum 0, default 0 (stock count)
 *
 * Schema Options:
 *   - timestamps: true → automatically adds createdAt and updatedAt fields
 *
 * Exports:
 *   - Product (Mongoose model) → provides all MongoDB CRUD methods.
 *
 * Example Usage:
 *   import { Product } from "../models/Product.js";
 *   const items = await Product.find({});
 *   const created = await Product.create({ name: "Banana", category: "produce", price: 1.99, quantity: 100 });
 */

//Imports
import mongoose from "mongoose";

//1. Define the schema (fields, types, and basic validation rules)
const productSchema = new mongoose.Schema(
  {
    //MongoDB auto create a unique _id (Objectid). That is the id
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true, //store as lowercase = simpler case insensitive filters
    },
    price: {
      type: Number,
      required: true,
      min: 0, //no negative prices
    },
    quantity: {
      type: Number,
      required: true,
      min: 0, //no negative stock counts
      default: 0, // If not provided, we assume none in stock
    },
  },
  {
    //2. timestamps adds createdAt and updatedAt auto
    timestamps: true,
  }
);

//3. Turn schema into a Model. singular, capitalized
export const Product = mongoose.model("Product", productSchema);
