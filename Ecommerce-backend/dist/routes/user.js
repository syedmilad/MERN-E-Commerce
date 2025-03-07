import express from "express";
import { getAllUser, getUser, newUser, userDelete, } from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";
const app = express.Router();
// route - api/v1/user/new
app.post("/new", newUser);
app.get("/all", getAllUser);
app.get("/:id", adminOnly, getUser);
app.delete("/:id", adminOnly, userDelete);
export default app;
