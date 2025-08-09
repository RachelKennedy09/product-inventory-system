// This file holds the code that runs when a route is hit
// Our route will call getProducts which returns an array of products

//Imports

import { Product } from "./models/Product.js";

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
