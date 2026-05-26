# Fastcart Admin2

Fastcart Admin2 - отдельный React-проект админ-панели для интернет-магазина Fastcart. Он вынесен отдельно от магазина, поэтому его можно запускать, проверять и дорабатывать как самостоятельное приложение.

Админка работает с тем же backend API, что и основной магазин.

## Что умеет проект

- вход в админку через API;
- проверка роли пользователя;
- доступ только для `Admin` и `SuperAdmin`;
- dashboard со статистикой;
- chart продаж;
- список top selling products;
- переход `See All` из dashboard в `Products`;
- список товаров;
- добавление товара;
- редактирование товара;
- удаление товара;
- мультизагрузка фото товара;
- выбор brand/category/sub-category/color;
- создание нового color;
- создание новой sub-category;
- список категорий;
- добавление категории;
- редактирование категории;
- удаление категории;
- загрузка фото категории;
- список брендов;
- добавление бренда;
- редактирование бренда;
- удаление бренда;
- список пользователей;
- просмотр ролей;
- добавление роли пользователю;
- удаление роли у пользователя;
- удаление пользователя.

## Стек

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- React Router
- Lucide React icons
- Fetch API

В этом проекте нет Redux. Для админки состояние хранится проще: через `useState` внутри `DashboardPage.tsx`.

## Запуск

```bash
npm install
npm run dev
```

Адрес:

```text
http://127.0.0.1:5174/login
```

Проверка TypeScript:

```bash
npx tsc -p tsconfig.app.json --noEmit
```

Сборка:

```bash
npm run build
```

## Env

Файл `.env`:

```env
VITE_API_URL=https://fastcard-1-o23z.onrender.com/api
```

Эта переменная используется в `src/api/adminApi.ts`.

## Структура проекта

```text
admin2/
  index.html
  package.json
  vite.config.ts
  tsconfig.json
  tsconfig.app.json
  tsconfig.node.json
  src/
    api/
      adminApi.ts
    assets/
      logotipe.png
    components/
      AdminLayout.tsx
      SalesChart.tsx
    pages/
      LoginPage.tsx
      DashboardPage.tsx
    utils/
      auth.ts
      images.ts
    App.tsx
    index.css
    main.tsx
    types.ts
```

## Основные файлы

### `src/main.tsx`

Точка входа проекта.

Что делает:

- подключает React;
- подключает `BrowserRouter`;
- подключает глобальные стили `index.css`;
- рендерит `App`.

### `src/App.tsx`

Главный роутер админки.

Роуты:

- `/login` - страница входа;
- `/*` - защищенная админка.

Внутри есть `ProtectedAdmin`.

`ProtectedAdmin`:

- берет token из `localStorage`;
- читает пользователя из JWT;
- проверяет роль;
- если роли admin нет, отправляет на `/login`;
- если роль подходит, открывает `DashboardPage`.

### `src/pages/LoginPage.tsx`

Страница входа в админку.

Что делает:

- показывает форму в стиле макета;
- принимает email/username;
- принимает password;
- умеет показать/скрыть пароль;
- отправляет запрос на login;
- сохраняет token;
- проверяет роль;
- если пользователь admin, переносит в dashboard;
- если обычный user, показывает ошибку.

Запрос:

```text
POST /Account/login
```

### `src/pages/DashboardPage.tsx`

Главная страница всей админки.

В этом файле лежит основная логика:

- загрузка products;
- загрузка brands;
- загрузка categories;
- загрузка colors;
- загрузка users;
- загрузка roles;
- dashboard;
- products screen;
- product form;
- orders screen;
- categories screen;
- brands screen;
- users screen.

Главные состояния:

- `screen` - какой раздел сейчас открыт;
- `products` - список товаров;
- `brands` - список брендов;
- `categories` - список категорий;
- `colors` - список цветов;
- `subCategories` - sub-category выбранной категории;
- `users` - список пользователей;
- `roles` - список ролей;
- `search` - поиск в topbar;
- `message` - статус загрузки/ошибки;
- `productForm` - форма товара;
- `brandName`, `brandEditId` - форма бренда;
- `categoryName`, `categoryEditId`, `categoryImage` - форма категории;
- `newColorName` - создание цвета;
- `newSubCategoryName` - создание sub-category.

## API слой

Все запросы лежат в:

```text
src/api/adminApi.ts
```

Там есть общая функция:

```ts
apiRequest<T>(path, options)
```

Она:

- берет token из `localStorage`;
- добавляет `Authorization: Bearer token`;
- делает `fetch`;
- если API вернул ошибку, достает текст ошибки;
- возвращает JSON.

## API функции

### Account

```ts
loginAdmin(userName, password)
```

Вход в админку.

Endpoint:

```text
POST /Account/login
```

### Product

```ts
getProducts()
```

Получает список товаров.

```ts
addProduct(formData)
```

Добавляет товар. Использует `FormData`, потому что API принимает фото.

Поля:

- `ProductName`
- `Price`
- `HasDiscount`
- `Code`
- `Description`
- `DiscountPrice`
- `Quantity`
- `Weight`
- `Size`
- `BrandId`
- `ColorId`
- `SubCategoryId`
- `Images`

```ts
updateProduct(payload)
```

Обновляет товар через JSON.

```ts
deleteProduct(id)
```

Удаляет товар.

### Brand

```ts
getBrands()
addBrand(brandName)
updateBrand(id, brandName)
deleteBrand(id)
```

Используются на экране `Brands`.

### Category

```ts
getCategories()
addCategory(formData)
updateCategory(formData)
deleteCategory(id)
```

`addCategory` и `updateCategory` используют `FormData`, потому что категория может иметь фото.

### Color

```ts
getColors()
addColor(colorName)
```

Цвета используются в форме товара.

### SubCategory

```ts
getSubCategories(categoryId)
addSubCategory(categoryId, subCategoryName)
```

Sub-category зависит от выбранной category.

### UserProfile

```ts
getUsers()
getRoles()
addRoleToUser(userId, roleId)
removeRoleFromUser(userId, roleId)
deleteUser(id)
```

Используется на экране `Users`.

## Auth utils

Файл:

```text
src/utils/auth.ts
```

Функции:

```ts
saveToken(token)
```

Сохраняет JWT в `localStorage`.

```ts
getToken()
```

Берет JWT из `localStorage`.

```ts
removeToken()
```

Удаляет JWT при logout.

```ts
getUserFromToken(token)
```

Достает из JWT:

- user id;
- username;
- email;
- roles.

```ts
isAdmin(user)
```

Проверяет, есть ли роль:

- `Admin`;
- `SuperAdmin`.

## Image utils

Файл:

```text
src/utils/images.ts
```

Функция:

```ts
getImageUrl(image)
```

Что делает:

- если картинки нет, возвращает логотип;
- если картинка уже является полным URL, возвращает как есть;
- если API вернул только имя файла, собирает полный URL через backend.

## Components

### `AdminLayout.tsx`

Общий layout админки.

Внутри:

- sidebar;
- logo;
- navigation;
- topbar;
- search;
- notification/message buttons;
- profile badge;
- logout.

Навигация переключает `screen` в `DashboardPage`.

### `SalesChart.tsx`

Ручной SVG chart.

Что делает:

- рисует линию продаж;
- показывает tooltip;
- при движении мыши меняет активную точку.

## Screens

### Dashboard

Показывает:

- Sales;
- Cost;
- Profit;
- Sales Revenue chart;
- Top selling products;
- Recent transactions;
- Top Products by Units Sold.

Кнопка `See All` в top selling products переключает экран на `Products`.

### Products

Показывает таблицу товаров.

Функции:

- поиск;
- add product;
- edit product;
- delete product.

### Product Form

Открывается при добавлении или редактировании товара.

Поля:

- product name;
- product code;
- description;
- category;
- sub-category;
- brand;
- price;
- discount price;
- quantity;
- size;
- weight;
- has discount;
- color;
- images.

Также можно:

- создать новый color;
- создать новую sub-category;
- выбрать несколько фото.

### Orders

Показывает таблицу заказов.

Важно: полноценного order API в swagger нет, поэтому orders собираются локально из products/users для dashboard UI.

### Categories

Функции:

- add category;
- edit category;
- delete category;
- upload category image.

### Brands

Функции:

- add brand;
- edit brand;
- delete brand.

### Users

Функции:

- просмотр user list;
- просмотр ролей;
- add role;
- remove role;
- delete user.

Текущего пользователя нельзя удобно удалять через UI, чтобы случайно не потерять доступ.

## Data flow

1. Пользователь входит через login.
2. API возвращает JWT.
3. Token сохраняется в `localStorage`.
4. `ProtectedAdmin` проверяет token и роль.
5. `DashboardPage` вызывает `loadData`.
6. `loadData` загружает products, brands, categories, colors, users, roles.
7. UI показывает данные.
8. После add/edit/delete вызывается `loadData` еще раз, чтобы обновить таблицы.

## Почему нет Redux

В этой отдельной админке Redux не нужен. Данные не расходятся по большому количеству страниц, поэтому проще держать их в одном месте:

```text
DashboardPage.tsx
```

Так код легче читать и проще объяснить.

## Ограничения

- Orders пока локальные, потому что в swagger нет полноценного order API.
- Баннеры в `admin2` пока не вынесены отдельным экраном.
- При редактировании товара API принимает JSON и не обновляет фото. Фото отправляются при добавлении товара через `FormData`.
- Backend на Render может отвечать медленно после простоя.

## Что не коммитить

- `node_modules`
- `dist`
- приватные `.env` файлы, если там есть секретные ключи

## Быстрые команды

```bash
npm install
npm run dev
npx tsc -p tsconfig.app.json --noEmit
```

## Адреса

Login:

```text
http://127.0.0.1:5174/login
```

Dashboard после входа:

```text
http://127.0.0.1:5174/dashboard
```
