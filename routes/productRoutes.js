/**
 * productRoutes.js
 *
 * Purpose:
 *   Defines all REST API routes for products and maps them to controller functions.
 *   These routes are mounted under the base path `/api/products` in server.js.
 *
 * Routes:
 *   - GET    /api/products              → getProducts()      → Return all products
 *   - POST   /api/products              → createProduct()    → Create a new product
 *
 *   - GET    /api/products/sort/:key    → sortProducts()     → Sort products using QuickSort
 *   - GET    /api/products/search/:key/:value
 *                                        → searchProduct()   → Binary Search for exact match
 *
 *   - GET    /api/products/:id          → getProductById()   → Return a product by MongoDB _id
 *   - PUT    /api/products/:id          → updateProduct()    → Update price, quantity, or category
 *   - DELETE /api/products/:id          → deleteProduct()    → Delete a product by MongoDB _id
 *
 * Notes:
 *   - Routes delegate logic to controller functions in productController.js.
 *   - Algorithms (QuickSort & Binary Search) are exposed as API endpoints for Sprint 3 demonstration.
 */

// Map HTTP endpoints to controller functions.
import { Router } from "express";
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  sortProducts,
  searchProduct,
} from "../controllers/productController.js";

const router = Router();

// READ ALL - send a get request to /api/products with JSON body
router.get("/", getProducts); //GET /api/products

// CREATE - send a post request to /api/products with JSON body
router.post("/", createProduct); //POST /api/product

// ALGORITHMS - quickSort and binarySearch
router.get("/sort/:key", sortProducts);
router.get("/search/:key/:value", searchProduct);

// GET BY  ID
router.get("/:id", getProductById); //GET /api/product/:id

// UPDATE By Id
router.put("/:id", updateProduct); // UPDATE /api/product/:id

// DELETE by id
router.delete("/:id", deleteProduct); // DELETE /api/product/:id

export default router;
