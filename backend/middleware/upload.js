import { upload } from '../utils/cloudinary.js';

// Middleware для завантаження аватару
export const uploadAvatar = upload.single('avatar');

// Middleware для завантаження зображення товару
export const uploadProductImage = upload.single('image');

// Middleware для завантаження зображення категорії
export const uploadCategoryImage = upload.single('image');