import { NextFunction, Request, Response } from "express";
import {
  BaseQuery,
  NewProductRequestBody,
  SearchProductQuery,
} from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { faker } from "@faker-js/faker";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";

export const newProduct = async (
  req: Request<{}, {}, NewProductRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, price, stock, category } = req.body;
    const photo = req?.file; // if all feilds are empty except photo, so photo will be store on upload folder.

    if (!photo) {
      return next(new ErrorHandler("Please Add photo", 404));
    }
    if (!name || !price || !stock || !category) {
      rm(photo?.path, () => {
        console.log("photo deleted");
      });
      return next(new ErrorHandler("Please add all feilds", 404));
    }
    /** For deleting photo on upload folder */

    await Product.create({
      name,
      price,
      stock,
      category,
      photo: photo?.path,
    });

    await invalidateCache({product: true})

    return res.status(201).json({
      success: true,
      message: "Product Created Successfully",
    });
  } catch (error) {
    return next(new ErrorHandler("Not Created!", 404));
  }
};

export const getLatestProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let products;

    // Debug: Log cache state
    console.log("Cache keys:", myCache.keys());
    console.log(
      "Cache has key 'latest-product':",
      myCache.has("latest-product")
    );

    if (myCache.has("latest-product")) {
      console.log({ cache: true });
      products = JSON.parse(myCache.get("latest-product") as string);
    } else {
      console.log({ cache: false });
      products = await Product.find({}).sort({ createdAt: -1 }).limit(5);

      // Set cache with a TTL (e.g., 10 minutes)
      myCache.set("latest-product", JSON.stringify(products)); // 10 minutes

      // Debug: Log the products being cached
      console.log("Products fetched from DB and cached:", products);
    }

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error in getLatestProduct:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};
export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let allCategories;

    if (myCache.has("allCategories")) {
      allCategories = JSON.parse(myCache.get("allCategories") as string);
    } else {
      allCategories = await Product.distinct("category");
      myCache.set("allCategories", JSON.stringify(allCategories));
    }

    if (allCategories) {
      return res.status(200).json({
        success: true,
        allCategories: allCategories,
      });
    }
  } catch (error) {
    return res.status(404).json({
      success: false,
      error: error,
    });
  }
};

export const getAdminProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let products;
    if(myCache.has("products")){
        products = JSON.parse(myCache.get("products") as string)
    }else{
        products = await Product.find({});
        myCache.set('product',JSON.stringify(products))
    }
    if (products) {
      return res.status(200).json({
        success: true,
        products: products,
      });
    }
  } catch (error) {
    return res.status(404).json({
      success: false,
      error: error,
    });
  }
};
export const getSingleProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    let product;
    if(myCache.has(`product-${id}`)){
        product = JSON.parse(myCache.get("product") as string)
    }else{
        product = await Product.findById(id)
        myCache.set(`product-${id}`,JSON.stringify(product))
    }
    if (product) {
      return res.status(200).json({
        success: true,
        product,
      });
    }
  } catch (error) {
    return res.status(404).json({
      success: false,
      error: error,
    });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const photo = req?.file; // if all fields are empty except photo, so photo will be stored in the upload folder.
    const product = await Product.findById(id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    // Delete old photo if a new photo is provided
    if (photo) {
      rm(product.photo, () => {
        console.log("Old Photo deleted");
      });
      product.photo = photo.path;
    }

    // Update product fields if they are provided in the request
    if (name) product.name = name;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    // Save the updated product
    await product.save();
    await invalidateCache({product: true})

    return res.status(201).json({
      success: true,
      message: "Product Updated Successfully",
    });
  } catch (error) {
    return next(new ErrorHandler("Product Update Failed!", 500));
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return next(new ErrorHandler("Product Not Found", 404));
    }

    rm(product.photo, () => {
      console.log("Product Photo Deleted");
    });
    await product.deleteOne();
    await invalidateCache({product: true})

    return res.status(201).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      error: error,
    });
  }
};
export const getAllProducts = async (
  req: Request<{}, {}, {}, SearchProductQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { price, category, stock, search, sort } = req.query;
    const page = Number(req.query.page);
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;

    const baseQuery: BaseQuery = {};

    if (search) {
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };
    }
    if (price) {
      baseQuery.price = {
        $lte: Number(price),
      };
    }
    if (category) {
      baseQuery.category = category;
    }
    const productPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    /** resolve all promises */
    const [products, filterOnlyProducts] = await Promise.all([
      productPromise,
      Product.find(baseQuery),
    ]);
    const totalPages = Math.ceil(
      filterOnlyProducts.length / limit
    ); /** It's give totalPages */

    return res.status(201).json({
      success: true,
      products,
      totalPages,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      error: error,
    });
  }
};

async function createFakeProduct() {
  const products = [];
  for (let i = 0; i < 40; i++) {
    const product = {
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
      stock: faker.number.int({ min: 1, max: 100 }),
      category: faker.commerce.department(),
      photo: faker.image.url(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      __v: 0,
    };

    products.push(product);
  }
  await Product.create(products);
  console.log({ sucess: true });
}
async function deleteProducts() {
  const product = await Product.find({}).skip(2);
  for (let i = 0; i < product.length; i++) {
    const singleProduct = product[i];
    await singleProduct.deleteOne();
  }
  console.log({ sucess: true });
}
// createFakeProduct()
// deleteProducts()
