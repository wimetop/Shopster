import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
{
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Category name must be at least 2 characters'],
      maxlength: [50, 'Category name cannot exceed 50 characters']
    },
    image: {
      type: String,
      default: ''
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
},
{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

categorySchema.index({ name: 'text'});
// index({ name: 1 }) прибрани - бо unique: true вже створює індекс

const Category = mongoose.model("Category", categorySchema)

export default Category