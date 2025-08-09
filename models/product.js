// File defines the schema or a Product and exports a Model so the rest of the app can read/write products
// Other files will import { Product } from "../models/Product.js" and then call Product.find(), Product.create() etc..

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
