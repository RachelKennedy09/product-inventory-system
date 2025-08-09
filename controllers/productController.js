// This file holds the code that runs when a route is hit
// Our route will call getProducts which returns an array of products

//Imports

import { Product } from "../models/Product.js";

//READ ALL - GET /api/products
export async function getProducts(req, res) {
  try {
    //1. No filters yet, reads everything from the collection
    // .Lean() returns plain JS objects instead fo full mongoose documents
    const items = await Product.find({}).lean();

    //2. Send the array back. If DB is empty, you'll see []
    res.json(items);
  } catch (err) {
    // 3. If something goes wrong, return a 500 with the error message.
    res.status(500).json({ error: err.message });
  }
}

//CREATE - POST /api/products
// Requests JSON body 
// Error and success handling messages

export async function createProduct(req, res) {
  try {
    //1. pull fields from the JSON body
    const { name, category, price, quantity } = req.body;

    //2. validation (null catches both undefined and null so - is valid)
    if (!name || !category || price == null || quantity == null) {
      return res.status(400).json({
        error: "name, category, price, and quantity are required",
      });
    }

    //Type checks for user clarity
    if (typeof name !== "string" || typeof category !== "string") {
      return res
        .status(400)
        .json({ error: "name and category must be strings" });
    }
    if (typeof price !== "number" || typeof quantity !== "number") {
      return res
        .status(400)
        .json({ error: "price and quantity must be numbers" });
    }
    if (price < 0 || quantity < 0) {
      return res
        .status(400)
        .json({ error: "price and quantity cannot be negative" });
    }

    // 3. create the product in MongoDB
    const created = await Product.create({ name, category, price, quantity });

    //4. respond with 201 create and the new product
    return res.status(201).json(created);
  } catch (err) {
    //5. if anything unexpected happens (e.g. DB down), return 500 (server error)
    return res.status(500).json({ error: err.message });
  }
}
