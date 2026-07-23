# Shopster Backend API

## 🚀 Швидкий старт

### Вимоги
- Node.js 20+ (рекомендовано 20 LTS для стабільної роботи тестів)
- MongoDB Atlas або локальний MongoDB

### Встановлення
```bash
npm install
```

### Змінні середовища (.env)
```env
PORT=3000
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/shopster

# JWT для авторизації
JWT_SECRET=your_secret_key_here

# Cloudinary для зображень (опціонально)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Запуск
```bash
npm start        # Сервер (localhost:3000)
npm run seed     # Тестові дані
npm test         # Тести (node --test)
```

---

## 📚 API Документація

### Базовий URL
```
http://localhost:3000/api/
```

### Авторизація (Auth)

| Метод | Ендпоінт | Опис | Авторизація |
|-------|-----------|------|-------------|
| POST | `/auth/register` | Реєстрація | ❌ |
| POST | `/auth/login` | Логін | ❌ |
| POST | `/auth/refresh` | Оновити токен | ❌ |
| POST | `/auth/logout` | Вихід | ✅ Bearer токен |
| PATCH | `/auth/avatar` | Завантажити аватар | ✅ Bearer токен |
| GET | `/auth/me` | Профіль | ✅ Bearer токен |

**Приклад реєстрації:**
```json
POST /api/auth/register
Content-Type: application/json

{
  "name": "Іван Петров",
  "email": "ivan@example.com",
  "password": "password123"
}
```

**Відповідь:**
```json
{
  "user": {
    "_id": "665...",
    "name": "Іван Петров",
    "email": "ivan@example.com",
    "role": "user",
    "avatar": ""
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### Товари (Products)

| Метод | Ендпоінт | Опис | Авторизація |
|-------|-----------|------|-------------|
| GET | `/products` | Список товарів | ❌ |
| GET | `/products/:id` | Один товар | ❌ |
| POST | `/products` | Створити товар | 👑 Admin |
| PATCH | `/products/:id` | Оновити товар | 👑 Admin |
| DELETE | `/products/:id` | Видалити товар | 👑 Admin |

**GET /products параметри:**
```
?page=1          # Сторінка (за замовчуванням 1)
?limit=20        # На сторінку (за замовчуванням 20)
?category=ID     # Фільтр за категорією
?minPrice=100    # Мінімальна ціна
?maxPrice=500    # Максимальна ціна
?search=iphone    # Пошук за назвою
?sort=price       # Сортування (price, -price, name)
```

**Відповідь:**
```json
{
  "products": [...],
  "page": 1,
  "pages": 5,
  "total": 100
}
```

---

### Категорії (Categories)

| Метод | Ендпоінт | Опис | Авторизація |
|-------|-----------|------|-------------|
| GET | `/categories` | Список | ❌ |
| GET | `/categories/:id` | Одна категорія | ❌ |
| POST | `/categories` | Створити | 👑 Admin |
| PUT/PATCH | `/categories/:id` | Оновити | 👑 Admin |
| DELETE | `/categories/:id` | Видалити | 👑 Admin |

---

### Кошик (Cart)

| Метод | Ендпоінт | Опис | Авторизація |
|-------|-----------|------|-------------|
| GET | `/cart` | Мій кошик | ✅ |
| POST | `/cart` | Додати товар | ✅ |
| PUT | `/cart/item` | Оновити кількість | ✅ |
| DELETE | `/cart/item/:id` | Видалити товар | ✅ |
| DELETE | `/cart` | Очистити | ✅ |

**POST /cart тіло:**
```json
{
  "productId": "665...",
  "quantity": 2
}
```

---

### Замовлення (Orders)

| Метод | Ендпоінт | Опис | Авторизація |
|-------|-----------|------|-------------|
| GET | `/orders/my` | Мої замовлення | ✅ |
| GET | `/orders` | Усі (admin) | 👑 Admin |
| POST | `/orders` | Створити з кошика | ✅ |
| PUT | `/orders/:id/status` | Змінити статус | 👑 Admin |

---

**⚠️ ВАЖЛИВО! Як створити замовлення:**

1. **Спочатку додайте товари в кошик** (GET `/cart`, POST `/cart`)
2. **Потім створіть замовлення** - воно скопіює товари з кошика

**POST /orders тіло:**
```json
{
  "shippingAddress": {
    "fullName": "Іван Петров",
    "address": "вул. Хрещатик 15",
    "city": "Київ",
    "postalCode": "01001",
    "phone": "+380991234567"
  }
}
```

**Що автоматично підставляється:**
- `user` — береться з вашого токену
- `orderItems` — копіюються з кошика
- `totalPrice` — розраховується автоматично

**Приклад workflow:**
```
1. POST /auth/login → отримати токен
2. POST /cart { productId, quantity } → додати в кошик  
3. POST /orders { shippingAddress } → створити замовлення
4. Кошик автоматично очищується!
```

---

### Відгуки (Reviews)

| Метод | Ендпоінт | Опис | Авторизація |
|-------|-----------|------|-------------|
| GET | `/reviews/product/:productId` | Відгуки до товару | ❌ |
| POST | `/reviews` | Додати відгук | ✅ |
| DELETE | `/reviews/:id` | Видалити відгук | ✅ (власник/адмін) |
| GET | `/reviews` | Усі відгуки (admin) | 👑 Admin |

---

### Користувачі (Users) - Admin

| Метод | Ендпоінт | Опис | Авторизація |
|-------|-----------|------|-------------|
| GET | `/users` | Список користувачів | 👑 Admin |
| GET | `/users/:id` | Користувач | 👑 Admin |
| PUT/PATCH | `/users/:id` | Оновити | 👑 Admin |
| DELETE | `/users/:id` | Видалити | 👑 Admin |

---

## 🔐 JWT Токени - Де береться та як використовувати

### Де отримати токен?
| Запит | Опис | Повертає |
|-------|------|----------|
| `POST /api/auth/register` | Реєстрація | `accessToken`, `refreshToken` |
| `POST /api/auth/login` | Логін | `accessToken`, `refreshToken` |

### Відповідь при реєстрації/логіні
```json
{
  "user": { "_id": "...", "name": "...", "email": "...", "role": "user" },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",  // 7 днів
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."   // 30 днів
}
```

### Як використовувати токен?
<!-- Заголовок HTTP -->
**Заголовок для всіх захищених запитів:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Типи доступу
| Маркування | Означення | Приклад |
|-----------|-----------|---------|
| 👑 Admin | Тільки адмін | Створення/зміна товарів |
| ✅ | Люди, які залогінилися | Додавання в кошик, замовлення |
| ❌ | Публічний доступ | Перегляд товарів |

---

### Авторизація (Auth)

---

## 📝 Приклади запитів для Postman

### 1. Реєстрація та отримання токену
```
1. POST /api/auth/register → отримати accessToken
2. Використовувати accessToken в заголовку Authorization: Bearer <token>
```

### 2. Перегляд товарів
```
GET /api/products?page=1&limit=10&search=iphone&sort=-price
```

### 3. Додавання в кошик
```
POST /api/cart
Authorization: Bearer <token>
{ "productId": "<id>", "quantity": 1 }
```

### 4. Створення замовлення
```
POST /api/orders
Authorization: Bearer <token>
{ "shippingAddress": { ... } }
```

---

## 🧪 Тести

Запуск:
```bash
npm test
```

Покриття:
- Моделі: User, Category, Cart, Order, Review
- Контролери: Product, Auth

---

## 📦 Структура проекту

```
backend/
├── controllers/       # Бізнес-логіка
│   ├── authController.js
│   ├── productController.js
│   ├── categoryController.js
│   ├── cartController.js
│   ├── orderController.js
│   ├── reviewController.js
│   └── userController.js
├── middleware/        # Middleware
│   ├── auth.js        # JWT auth
│   └── upload.js      # Cloudinary upload
├── models/            # Mongoose схеми
├── routes/            # Express роути
│   ├── user.js        # /api/auth/*
│   ├── users.js       # /api/users/*
│   ├── product.js     # /api/products/*
│   ├── category.js    # /api/categories/*
│   ├── cart.js        # /api/cart/*
│   ├── order.js       # /api/orders/*
│   └── review.js      # /api/reviews/*
├── seeds/             # Тестові дані
├── tests/             # Тести
├── utils/             # Утиліти
└── index.js           # Головний файл
```

---

## 💻 Приклади коду для Frontend (React)

### Axios Setup
```javascript
// src/axios.js
import axios from 'axios';

axios.defaults.baseURL = '/api';
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### React Query / Fetch приклади

**1. Реєстрація:**
```javascript
const register = async (data) => {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  localStorage.setItem('token', json.accessToken);
};
```

**2. Отримати товари:**
```javascript
const getProducts = async (params) => {
  const q = new URLSearchParams(params).toString();
  const res = await fetch(`/api/products?${q}`);
  return res.json(); // { products: [...], page, pages, total }
};
```

**3. Додати в кошик:**
```javascript
const addToCart = async (productId, quantity) => {
  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ productId, quantity })
  });
  return res.json();
};
```

---

## 🚀 Деплой

- **Backend:** Render або Railway
- **Frontend:** Vercel

---

*Готово для учасника 3 (Frontend)* 🚀