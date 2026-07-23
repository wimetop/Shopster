import mongoose from "mongoose"


const productSchema = new mongoose.Schema(
    {
        name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters'],
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },
        description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
        price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number']
    },
    oldPrice: {
      type: Number,
      min: [0, 'Old price must be a positive number']
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: '' },
        isMain: { type: Boolean, default: false }
      }
    ],
    inStock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock must be a non-negative number'],
      default: 0
    },
    brand: {
      type: String,
      trim: true,
      maxlength: [50, 'Brand name cannot exceed 50 characters']
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    tags: [String],
    category: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        }

    },
    {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
    });

productSchema.index({
    name: 1
});
productSchema.index({
    category: 1
});
productSchema.index({
    price: 1
});
productSchema.index({ category: 1, price: 1 });

const Product = mongoose.model("Product", productSchema)

export default Product