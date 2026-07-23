import Category from '../models/Category.js';

// Отримати всі категорії
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Отримати категорію за ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Створити категорію (тільки admin)
export const createCategory = async (req, res) => {
  try {
    const categoryData = { ...req.body };

    // Якщо завантажено файл, зберігаємо URL
    if (req.file) {
      categoryData.image = req.file.path;
    }

    const category = await Category.create(categoryData);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Оновити категорію (тільки admin)
export const updateCategory = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Якщо завантажено файл, оновлюємо зображення
    if (req.file) {
      updateData.image = req.file.path;
    } else if (req.body.image === null || req.body.image === '') {
      // Якщо явно вказали щоб видалити (надсилаємо пустий рядок)
      updateData.image = '';
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Видалити категорію (тільки admin)
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
