import { NextFunction, Response } from "express";

export interface NewUserRequestBody {
  name: string;
  email: string;
  photo: string;
  gender: string;
  role: string;
  _id: string;
  dob: Date;
}
export interface NewProductRequestBody {
  name: string;
  price: number;
  stock: string;
  category: string;
}
export interface SearchProductQuery {
  search?: string;
  price?: number;
  stock?: string;
  category?: string;
  page?: string;
  sort?: string;
}
export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;
export interface BaseQuery {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: {
    $lte: number;
  };
  category?: string;
}

export type InvalidateCacheProps = {
  product?: boolean;
  orders?: boolean;
  admin?: boolean;
  userId?: string;
};

export type orderItemTypes = {
  name: string;
  photo: string;
  price: string;
  quantity: number;
  productId: string;
};
export type shippingInfoProps = {
  address: string;
  state: string;
  country: string;
  city: number;
  pinCode: number;
};

export interface NewOrderRequestBody {
  shippingInfo: shippingInfoProps;
  user: string;
  subTotal: number;
  shippingCharges: number;
  tax: number;
  total: number;
  discount: number;
  orderItems: orderItemTypes[];
}

export interface CoupenType {
  code: string;
  amount: number;
}
