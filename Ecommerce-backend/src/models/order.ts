import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    shippingInfo: {
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      pinCode: {
        type: Number,
        required: true,
      },
    },
    user: {
      type: String,
      ref: "User" /** Collection refrence */,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    shippingCharges: {
      type: Number,
      required: true,
      default: 0,
    },
    tax: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered"],
      default: "Processing",
    },
    orderItems: [
      {
        name: String,
        photo: String,
        price: Number,
        quantity: Number,
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", schema);
