// File is for the endpoint path and which controller function handles it.
// Use under /api/products in server.js

// Map HTTP endpoints to controller functions.

import { Router } from "express";
import {
  getProducts,
  createProduct,
  getProductById,
} from "../controllers/productController.js";

const router = Router();

// READ ALL - send a get request to /api/products with JSON body
router.get("/", getProducts); //GET /api/products

// CREATE - send a post request to /api/products with JSON body
router.post("/", createProduct); //POST /api/product

// GET BY  ID
router.get("/:id", getProductById); //GET /api/product/:id

export default router;
