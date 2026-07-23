import express from "express"

import
{
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    replaceProduct,
    deleteProduct,
} from "../controllers/productController.js"

import { protect, admin } from "../middleware/auth.js"
import { uploadProductImage } from "../middleware/upload.js"



const productRouter = express.Router()

// Публічні роути (всі можуть бачити)
productRouter.get('/', getProducts)
productRouter.get('/:id', getProductById)


// Захищені роути - тільки admin може створювати/змінювати/видаляти
productRouter.post('/', protect, admin, uploadProductImage, createProduct)
productRouter.put('/:id', protect, admin, uploadProductImage, replaceProduct)
productRouter.patch('/:id', protect, admin, uploadProductImage, updateProduct)
productRouter.delete('/:id', protect, admin, deleteProduct)


export default productRouter