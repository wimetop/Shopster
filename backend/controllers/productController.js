import express from "express"
import Product from "../models/Product.js"




export const getProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      sort,
      page = 1,
      limit = 20
    } = req.query;

    // Будуємо query
    let query = Product.find();

    // Фільтр за категорією
    if (category) {
      query = query.where('category').equals(category);
    }

    // Фільтр за ціною
    if (minPrice || maxPrice) {
      query = query.where('price');
      if (minPrice) query = query.gte(Number(minPrice));
      if (maxPrice) query = query.lte(Number(maxPrice));
    }

    // Пошук за назвою
    if (search) {
      query = query.where('name').regex(new RegExp(search, 'i'));
    }

    // Сортування
    if (sort) {
      query = query.sort(sort);
    }

    // Пагінація
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(Number(limit));

    const products = await query.populate('category');
    const total = await Product.countDocuments();

    res.status(200).json({
      products,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


    
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


    
export const createProduct = async (req, res) => {
  try {
    let images = [];

    // Якщо файл завантажений, додаємо його до масиву зображень
    if (req.file) {
      images.push({
        url: req.file.path,
        publicId: req.file.filename,
        isMain: true
      });
    }

    const productData = {
      ...req.body,
      images
    };

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { images } = req.body;
    const updateData = { ...req.body };

    // Якщо завантажено новий файл, додаємо його до зображень
    if (req.file) {
      const newImage = {
        url: req.file.path,
        publicId: req.file.filename,
        isMain: true
      };
      updateData.$push = { images: newImage };
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};    
export const replaceProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    // Якщо завантажено новий файл, додаємо його до зображень
    if (req.file) {
      productData.images = [{
        url: req.file.path,
        publicId: req.file.filename,
        isMain: true
      }];
    }

    const product = await Product.findOneAndReplace(
      { _id: req.params.id },
      productData,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Видалення товару
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};