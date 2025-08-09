// File is for the endpoint path and which controller function handles it.
// Use under /api/products in server.js

// Map HTTP endpoints to controller functions.

import { Router } from "express";
import { getProducts } from "../controllers/productController.js";

const router = Router();

// READ ALL
router.get("/", getProducts); //GET /api/products

export default router;
