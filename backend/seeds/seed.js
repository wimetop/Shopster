import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "1.0.0.1"]);


dotenv.config();

// Sample data arrays
const sampleNames = [
  'Олександр Петров',
  'Марія Коваленко',
  'Іван Сидоренко',
  'Катерина Шевченко',
  'Дмитро Бойко',
  'Анна Гончар',
  'Сергій Мельник',
  'Олена Ткаченко',
  'Віктор Лисенко',
  'Ірина Романенко'
];

const sampleEmails = [
  'oleksandr@example.com',
  'maria@example.com',
  'ivan@example.com',
  'katerina@example.com',
  'dmytro@example.com',
  'anna@example.com',
  'sergey@example.com',
  'olena@example.com',
  'viktor@example.com',
  'irina@example.com'
];

const categories = [
  { name: 'Електроніка', slug: 'electronics', image: 'https://picsum.photos/seed/electronics/400/300' },
  { name: 'Одяг', slug: 'clothing', image: 'https://picsum.photos/seed/clothing/400/300' },
  { name: 'Книги', slug: 'books', image: 'https://picsum.photos/seed/books/400/300' },
  { name: 'Спорт', slug: 'sports', image: 'https://picsum.photos/seed/sports/400/300' },
  { name: 'Дім та сад', slug: 'home-garden', image: 'https://picsum.photos/seed/home-garden/400/300' },
  { name: 'Кosметика', slug: 'cosmetics', image: 'https://picsum.photos/seed/cosmetics/400/300' }
];

const productNames = [
  'iPhone 15 Pro', 'Samsung Galaxy S24', 'Ноутбук Lenovo ThinkPad', 'Ноутбук Apple MacBook Air',
  'Куртка чоловіча', 'Джинси жіночі', 'Світшот Unisex', 'Футболка базова',
  'Книга "Гаррі Поттер"', 'Роман "1984" Джордж Оруелл', 'Детектив "Шерлок Холмс"',
  'Фітнес браслет', 'Гироскоп ролики', 'Гантеля 10кг', 'Футбольний мяч',
  'Кавоварка автоматична', 'Блузка жіноча', 'Чоловічі шкарпетки', 'Підручник з математики'
];

const productDescriptions = [
  'Високоякісний товар з современним дизайном та передовими технологіями.',
  'Надійний і довговічний продукт для вашого щоденного використання.',
  'Оптимальне співвідношення ціни та якості. Гарантія якості.',
  'Популярний товар серед наших клієнтів. Рекомендовано професіоналами.',
  'Інноваційний продукт з унікальним дизайном та функціями.'
];

const brands = ['Apple', 'Samsung', 'Lenovo', 'Nike', 'Adidas', 'Sony', 'LG', 'HP', 'Dell', 'Xiaomi'];

const sampleComments = [
  'Відмінний товар, рекомендую всім!',
  'Швидка доставка, гарна упаковка.',
  'Трохи розчарування якістю, але в цілому задоволений.',
  'Лучши продукт який я купував!',
  'Хороший товар за свої гроші.',
  'Дуже шумно працює, але в іншому все ок.',
  'Прекрасна комплектация, все як на фото.',
  'Потрібно було чекати, але воображення виправдовує!',
  'Рекомендую! Якість на висоті.',
  'Нормальний товар, ніщо особливе.'
];

const shippingFullNames = [
  'Іван Петров', 'Марія Коваль', 'Олексій Гончар', 'Катерина Бойко',
  'Дмитро Сидор', 'Олена Мельник', 'Сергій Шевченко', 'Анна Лисенко',
  'Віктор Пономаренко', 'Ганна Кравченко', 'Микола Білецький', 'Тетяна Руденська',
  'Андрій Ковальчук', 'Наталія Грицак', 'Павло Семенюк', 'Оксана Іваненко'
];

const addresses = [
  'вул. Хрещатик, 15',
  'вул. Булаба, 22',
  'вул. Льва Толстого, 8',
  'вул. Саксаганського, 43',
  'вул. Велика Васильківська, 12',
  'вул. Григорія Сковороди, 56',
  'вул. Дорошенка, 14',
  'вул. Франка, 28',
  'вул. Шевченка, 7',
  'вул. Миколая Васильченка, 33',
  'вул. Печерська, 19',
  'вул. Богдана Хмельницького, 84'
];

const cities = ['Київ', 'Львів', 'Одеса', 'Харків', 'Дніпро', 'Запоріжжя', 'Вінниця', 'Полтава', 'Чернігів', 'Івано-Франківськ'];

const postalCodes = ['01001', '79000', '65000', '61000', '49000', '40000'];

const phones = ['+380991234567', '+380972345678', '+380953456789', '+380634567890', '+380505678901', '+380986789012'];

// Helper function to generate random items from array
const getRandomItems = (arr, min, max) => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to generate random number in range
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to generate random float
const randomFloat = (min, max, decimals = 2) => {
  const num = Math.random() * (max - min) + min;
  return Math.round(num * 100) / 100;
};

// Clear database
const clearDatabase = async () => {
  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});
  await Cart.deleteMany({});
  await Order.deleteMany({});
  await Review.deleteMany({});
  console.log('✅ Database cleared');
};

// Seed Categories
const seedCategories = async () => {
  const createdCategories = await Category.insertMany(
    categories.map(cat => ({
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
      isActive: true
    }))
  );
  console.log(`✅ Created ${createdCategories.length} categories`);
  return createdCategories;
};

// Seed Users
const seedUsers = async () => {
  const users = sampleNames.map((name, index) => ({
    name,
    email: sampleEmails[index],
    password: 'password123', // Will be hashed if needed
    role: index === 0 ? 'admin' : 'user',
    phone: phones[index % phones.length],
    avatar: `https://picsum.photos/seed/user${index}/100/100`,
  }));

  const createdUsers = await User.insertMany(users);
  console.log(`✅ Created ${createdUsers.length} users`);
  return createdUsers;
};

// Seed Products
const seedProducts = async (categories) => {
  const products = [];

  for (let i = 0; i < 20; i++) {
    const category = categories[randomInt(0, categories.length - 1)];
    const name = productNames[randomInt(0, productNames.length - 1)];
    const price = randomFloat(100, 2000);
    const oldPrice = Math.random() > 0.5 ? price * 1.2 : null;

    products.push({
      name,
      description: productDescriptions[randomInt(0, productDescriptions.length - 1)],
      price,
      oldPrice,
      images: [
        {
          url: `https://picsum.photos/seed/product${i}/600/400`,
          publicId: `product_${i}`,
          isMain: true
        }
      ],
      inStock: randomInt(0, 100),
      brand: brands[randomInt(0, brands.length - 1)],
      rating: randomFloat(1, 5),
      numReviews: randomInt(0, 50),
      isActive: true,
      tags: getRandomItems(['new', 'sale', 'popular', 'featured', 'trending'], 1, 3),
      category: category._id
    });
  }

  const createdProducts = await Product.insertMany(products);
  console.log(`✅ Created ${createdProducts.length} products`);
  return createdProducts;
};

// Seed Carts
const seedCarts = async (users, products) => {
  const carts = users.map((user, index) => {
    const cartProducts = randomInt(0, 5);
    const items = [];
    let totalItems = 0;
    let totalPrice = 0;

    for (let i = 0; i < cartProducts; i++) {
      const product = products[randomInt(0, products.length - 1)];
      const quantity = randomInt(1, 5);
      items.push({
        product: product._id,
        quantity,
        price: product.price
      });
      totalItems += quantity;
      totalPrice += product.price * quantity;
    }

    return {
      user: user._id,
      items,
      totalItems,
      totalPrice: Math.round(totalPrice * 100) / 100
    };
  });

  const createdCarts = await Cart.insertMany(carts);
  console.log(`✅ Created ${createdCarts.length} carts`);
  return createdCarts;
};

// Seed Reviews
const seedReviews = async (users, products) => {
  const reviews = [];
  const usedPairs = new Set(); // Track used user+product pairs to avoid duplicates

  // Create multiple reviews per product
  for (let i = 0; i < 30; i++) {
    let user, product, pairKey;

    // Keep trying until we get a unique user+product pair
    do {
      user = users[randomInt(0, users.length - 1)];
      product = products[randomInt(0, products.length - 1)];
      pairKey = `${user._id.toString()}-${product._id.toString()}`;
    } while (usedPairs.has(pairKey));

    usedPairs.add(pairKey);

    reviews.push({
      user: user._id,
      product: product._id,
      rating: randomInt(1, 5),
      comment: sampleComments[randomInt(0, sampleComments.length - 1)]
    });
  }

  // Use insertMany with ordered: false to skip duplicates (unique user+product constraint)
  const createdReviews = await Review.insertMany(reviews);
  console.log(`✅ Created ${createdReviews.length} reviews`);
  return createdReviews;
};

// Seed Orders
const seedOrders = async (users, products) => {
  const orders = [];

  for (let i = 0; i < 10; i++) {
    const user = users[randomInt(0, users.length - 1)];
    const numItems = randomInt(1, 4);
    const orderItems = [];
    let itemsPrice = 0;

    for (let j = 0; j < numItems; j++) {
      const product = products[randomInt(0, products.length - 1)];
      const quantity = randomInt(1, 3);
      orderItems.push({
        product: product._id,
        name: product.name,
        quantity,
        price: product.price,
        image: product.images[0].url
      });
      itemsPrice += product.price * quantity;
    }

    const shippingPrice = 99;
    const totalPrice = itemsPrice + shippingPrice;

    orders.push({
      user: user._id,
      orderItems,
      shippingAddress: {
        fullName: shippingFullNames[randomInt(0, shippingFullNames.length - 1)],
        address: addresses[randomInt(0, addresses.length - 1)],
        city: cities[randomInt(0, cities.length - 1)],
        postalCode: postalCodes[randomInt(0, postalCodes.length - 1)],
        phone: phones[randomInt(0, phones.length - 1)]
      },
      paymentMethod: ['credit_card', 'liqpay', 'stripe', 'cash'][randomInt(0, 3)],
      paymentResult: {
        id: `pay_${Math.random().toString(36).substr(2, 9)}`,
        status: 'completed',
        updateTime: new Date().toISOString(),
        email: user.email
      },
      itemsPrice,
      shippingPrice,
      totalPrice,
      status: ['new', 'processing', 'shipped', 'done', 'cancelled'][randomInt(0, 4)],
      isPaid: Math.random() > 0.3,
      paidAt: Math.random() > 0.3 ? new Date() : null,
      isDelivered: Math.random() > 0.5,
      deliveredAt: Math.random() > 0.7 ? new Date() : null,
      orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });
  }

  const createdOrders = await Order.insertMany(orders);
  console.log(`✅ Created ${createdOrders.length} orders`);
  return createdOrders;
};

// Main seed function
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URL || 'mongodb://localhost:27017/shopster';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await clearDatabase();

    // Seed data in order of dependencies
    const createdCategories = await seedCategories();
    const createdUsers = await seedUsers();
    const createdProducts = await seedProducts(createdCategories);
    const createdCarts = await seedCarts(createdUsers, createdProducts);
    const createdReviews = await seedReviews(createdUsers, createdProducts);
    const createdOrders = await seedOrders(createdUsers, createdProducts);

    console.log('\n🎉 Seed completed successfully!');
    console.log(`📊 Summary:
    - Users: ${createdUsers.length}
    - Categories: ${createdCategories.length}
    - Products: ${createdProducts.length}
    - Carts: ${createdCarts.length}
    - Reviews: ${createdReviews.length}
    - Orders: ${createdOrders.length}`);

  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

seedDatabase();