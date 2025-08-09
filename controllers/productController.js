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

// READ ONE - GET /api/products/:id
//Returns a single product by its Mongo_id
// Handles errors and success

export async function getProductById(req, res) {
  try {
    //1. Extract the id from the URL path, e.g. /api/products/5647bf789
    const { id } = req.params;

    //2. Ask Mongo for a document with this_id.
    // If "id" isn't a valid ObjectId format, mongoose will throw error (400)
    const item = await Product.findById(id);

    //3. if the item is null, the id was well-formed but not found in the collection (404)
    if (!item) {
      return res.status(404).json({ error: "Product not found" });
    }

    //4. Found it - return it
    return res.json(item);
  } catch (err) {
    //5. if the id string is invalid (bad length, etc.), mongoose throws a cast error
    //answer with 400 so clients know the id itself is malformed
    return res.status(400).json({ error: " Invalid product ID" });
  }
}

// UPDATE - PUT /api/products/:id
//Update price, quantity, and/or category of oen product, then return the updated doc
//Handles errors and success

export async function updateProduct(req, res) {
  try {
    //1. pull id from URL and fields from body
    const { id } = req.params;
    const { price, quantity, category } = req.body;

    //2. Build an updates object only with fields the client actually sent
    const updates = {};

    //price: allow 0 (so check against null/undefined, not falsy)
    if (price != null) {
      if (typeof price !== "number") {
        return res.status(400).json({ error: "price must be a number" });
      }
      if (price < 0) {
        return res.status(400).json({ error: "price cannot be negative" });
      }
      updates.price = price;
    }

    if (quantity != null) {
      if (typeof quantity !== "number") {
        return res.status(400).json({ error: "quantity must be a number" });
      }
      if (quantity < 0) {
        return res.status(400).json({ error: "quantity cannot be negative" });
      }
      updates.quantity = quantity;
    }

    if (category != null) {
      if (typeof category !== "string") {
        return res.status(400).json({ error: "category must be a string" });
      }
      // store lowercase to keep filtering predictable
      updates.category = category.toLowerCase();
    }

    // 3. if the client sent nothing to update, let them know
    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ error: "Provide at least one of: price, quantity, category" });
    }

    //4. find the doc by id and apply updates
    // { new: true } makes mongoose return the updated doc instead of the old one
    const updated = await Product.findByIdAndUpdate(id, updates, { new: true });

    //5. if no dov matched that id then 404 ( id shape ok but not found)
    if (!updated) {
      return res.status(404).json({ error: "Product not found" });
    }

    //6. finally success , send the updated product
    return res.json(updated);
  } catch (err) {
    //7. if id shape is invalid (not a proper ObjectId), mongoose throws a 404
    return res.status(400).json({ error: "invalid product ID" });
  }
}
