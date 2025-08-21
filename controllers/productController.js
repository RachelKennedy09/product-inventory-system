/**
 * productControllers.js
 *
 * Purpose:
 *   Contains all controller functions for the Product Inventory System API.
 *   Each function is called when a route in productRoutes.js is hit.
 *   Controllers handle input validation, interact with the Product model (MongoDB),
 *   and return JSON responses with appropriate HTTP status codes.
 *
 * Routes & Controllers:
 *   - GET    /api/products              → getProducts()      → Return all products
 *   - GET    /api/products/:id          → getProductById()   → Return single product by _id
 *   - POST   /api/products              → createProduct()    → Create a new product
 *   - PUT    /api/products/:id          → updateProduct()    → Update price/quantity/category
 *   - DELETE /api/products/:id          → deleteProduct()    → Delete product by _id
 *   - GET    /api/products/sort/:key    → sortProducts()     → Sort products using QuickSort
 *   - GET    /api/products/search/:key/:value
 *                                        → searchProduct()   → Binary Search for exact match
 *
 * Algorithms:
 *   - sortProducts() uses a custom, non-mutating QuickSort (O(n log n) average).
 *   - searchProduct() sorts ASC, then runs Binary Search (O(log n)).
 *
 * Error Handling:
 *   - Input validation for types, required fields, and valid sort/search keys.
 *   - Returns 400 (Bad Request) for invalid input, 404 (Not Found) for missing products,
 *     500 (Server Error) for unexpected DB/server failures.
 */

//Imports

import { Product } from "../models/Product.js";
import { quickSort } from "../utils/quicksort.js";
import { binarySearch } from "../utils/binarySearch.js";

//SORT PRODUCTS -  GET /api/products/sort/:key?order=asc|desc
export async function sortProducts(req, res) {
  try {
    const { key } = req.params;
    const order = (req.query.order || "asc").toLowerCase();

    // Validate inputs early to give clear error messages
    const validKeys = ["name", "category", "price", "quantity"];
    if (!validKeys.includes(key)) {
      return res.status(400).json({
        error: `Invalid sort key. Use one of: ${validKeys.join(", ")}`,
      });
    }

    if (!["asc", "desc"].includes(order)) {
      return res.status(400).json({
        error: "Invalid order. Use 'asc' or 'desc'.",
      });
    }

    // Pull all products. .lean() returns plain objects.
    const items = await Product.find({}).lean();

    // Run our QuickSort (non-mutating) and return the result
    const sorted = quickSort(items, key, order);
    return res.status(200).json(sorted);
  } catch (err) {
    // General server error (e.g., DB issue)
    return res.status(500).json({ error: err.message });
  }
}

// SEARCH PRODUCT - GET /api/products/search/:key/:value

export async function searchProduct(req, res) {
  try {
    const { key, value } = req.params;

    // Validate the search key
    const validKeys = ["name", "category", "price", "quantity"];
    if (!validKeys.includes(key)) {
      return res.status(400).json({
        error: `Invalid search key. Use one of: ${validKeys.join(", ")}`,
      });
    }

    // Convert string route param to a number if the field is numeric
    let searchValue = value;
    if (["price", "quantity"].includes(key)) {
      const num = Number(value);
      if (Number.isNaN(num)) {
        return res.status(400).json({ error: `${key} must be a number` });
      }
      searchValue = num;
    }

    // 1) Fetch data
    let items = await Product.find({}).lean();

    // 2) Sort ASC by the same key to satisfy Binary Search precondition
    items = quickSort(items, key, "asc");

    // 3) Run Binary Search (exact match)
    const found = binarySearch(items, key, searchValue);

    if (!found) {
      // Not an error — just means no product matched the exact value
      return res.status(404).json({ message: "Product not found" });
    }

    // Success — return the found object
    return res.status(200).json(found);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

//READ ALL - GET /api/products
export async function getProducts(req, res) {
  try {
    //1. No filters yet, reads everything from the collection
    // .Lean() returns plain JS objects instead fo full mongoose documents
    const items = await Product.find({}).lean();

    //2. Send the array back. If DB is empty, you'll see []
    return res.status(200).json(items);
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
    return res.status(200).json(item);
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
    return res
      .status(200)
      .json({ message: "Product updated", product: updated });
  } catch (err) {
    //7. if id shape is invalid (not a proper ObjectId), mongoose throws a 404
    return res.status(400).json({ error: "invalid product ID" });
  }
}

//DELETE - DELETE /api/products/:id
//Remove one product by its _id and confirm deletion
export async function deleteProduct(req, res) {
  try {
    //1. read id from URL
    const { id } = req.params;
    //2. ask mongo to delete teh doc with the _id
    const deleted = await Product.findByIdAndDelete(id);

    //3. if nothing was deleted, either it never existed or was already removed
    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }

    //4. success: return a tiny confirmation payload
    return res
      .status(200)
      .json({ message: "Product deleted", id: deleted._id });
  } catch (err) {
    //5. invalid objectId mongoose throws a respond 400
    return res.status(400).json({ error: "Invalid product ID" });
  }
}
