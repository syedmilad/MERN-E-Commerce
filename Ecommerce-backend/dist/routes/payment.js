import express from "express";
import { allCoupens, coupenDelete, discount, newCreateCoupen, } from "../controllers/payment.js";
import { adminOnly } from "../middlewares/auth.js";
const app = express.Router();
app.get("/discount", discount);
app.post("/coupen/new", adminOnly, newCreateCoupen);
app.get("/coupen/all", adminOnly, allCoupens);
app.delete("/coupen/:id", coupenDelete);
export default app;
