import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import {
  getAdminProducts,
  updateProduct,
  getAllCategories,
  getLatestProduct,
  getSingleProduct,
  newProduct,
  deleteProduct,
  getAllProducts,
} from "../controllers/product.js";
import { sinleUpload } from "../middlewares/multer.js";
const app = express.Router();

app.post("/new", sinleUpload, newProduct);
app.get("/all", getAllProducts);
app.get("/latest", getLatestProduct);
app.get("/categories", getAllCategories);
app.get("/admin-products", getAdminProducts);
app
  .route("/:id")
  .get(getSingleProduct)
  .put(updateProduct)
  .delete(deleteProduct);

export default app;
