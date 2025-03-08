import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Please Enter a Coupen Code"],
      unique: true,
    },
    amount: {
      type: Number,
      required: [true, "Please Enter a Coupen Amount"],
    },
  },
  { timestamps: true }
);

export const Coupen = mongoose.model("Coupen", schema);
