# Fastcart

Fastcart - учебный интернет-магазин на React. В проекте есть витрина магазина, авторизация, профиль, корзина, wishlist, фильтрация товаров, страница товара, checkout и админская часть.

Отдельная новая админка вынесена во второй проект: `admin2`.

## Стек

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Redux Toolkit
- React Redux
- React Router
- Axios
- Formik
- i18next / react-i18next
- Swiper
- AOS animation
- Lucide React icons
- shadcn-style UI компоненты в `src/components/ui`

## Запуск

```bash
npm install
npm run dev
```

Проверка типов:

```bash
npx tsc -p tsconfig.app.json --noEmit
```

Линтер:

```bash
npm run lint
```

Сборка есть в `package.json`, но на текущем этапе проекта обычно не нужна:

```bash
npm run build
```

## Env

В корне проекта нужен файл `.env`:

```env
VITE_API_URL=https://fastcard-1-o23z.onrender.com/api
```

`VITE_API_URL` используется для всех запросов к API.

## Структура проекта

```text
src/
  api/          запросы к backend
  assets/       локальные картинки проекта
  components/   переиспользуемые компоненты
  i18n/         переводы EN/RU
  lib/          маленькие helper-функции для UI
  pages/        страницы магазина
  store/        Redux store и slices
  types/        типы для библиотек без типов
  utils/        утилиты токена, картинок, цветов, пользователя
```

## Основные страницы

- `HomePage.tsx` - главная страница магазина: hero slider, категории, карточки товаров, баннер акции, таймер.
- `ProductsPage.tsx` - страница магазина с фильтрами по категории, бренду, цвету, цене и рейтингу.
- `ProductDetailsPage.tsx` - страница товара: галерея фото, цвет, размер, количество, покупка, wishlist.
- `CartPage.tsx` - корзина пользователя.
- `WishlistPage.tsx` - локальный wishlist.
- `CheckoutPage.tsx` - оформление покупки.
- `LoginPage.tsx` - вход.
- `SignUpPage.tsx` - регистрация.
- `AccountProfilePage.tsx` - профиль, аватар, роли, выход, переход в админку для admin.
- `AboutPage.tsx` - about page по макету.
- `ContactPage.tsx` - контактная страница.
- `NotFoundPage.tsx` - страница 404.
- `pages/admin/AdminPage.tsx` - старая админка внутри магазина.

## API слой

Файлы в `src/api` отвечают только за запросы:

- `auth.ts` - login/register.
- `productApi.ts` - товары: список, товар по id, добавление, обновление, удаление.
- `brandApi.ts` - бренды: список, добавление, обновление, удаление.
- `categoryApi.ts` - категории: список, добавление с фото, обновление с фото, удаление.
- `colorApi.ts` - цвета.
- `subCategoryApi.ts` - sub-category.
- `userProfileApi.ts` - профили пользователей, роли, удаление пользователей.
- `getApiErrorMessage.ts` - достает понятный текст ошибки из ответа API.
- `types.ts` - общие типы ответа API.

## Utils

- `utils/token.ts`
  - хранит JWT в `localStorage`;
  - создает `axiosRequest`;
  - добавляет `Authorization: Bearer token` в запросы.

- `utils/authUser.ts`
  - читает данные пользователя из JWT;
  - проверяет admin/superadmin роль;
  - форматирует дату окончания токена.

- `utils/images.ts`
  - превращает имя картинки из API в полный URL;
  - если картинки нет, показывает логотип.

- `utils/colors.ts`
  - переводит название цвета вроде `Skyblue`, `Black`, `Gold` в CSS цвет.

## Store

Redux лежит в `src/store`.

- `store.ts` - общий Redux store.
- `hooks.ts` - простые хуки `useAppDispatch` и `useAppSelector`.
- `authSlice.ts`
  - хранит token и user;
  - делает login/register;
  - logout очищает пользователя.
- `catalogSlice.ts`
  - загружает products, categories, brands, colors, subCategories.
- `cartSlice.ts`
  - хранит корзину;
  - если пользователь не вошел, добавление в корзину перекидывает на login на уровне UI;
  - wishlist локальный, cart связан с действиями пользователя.
- `wishlistSlice.ts`
  - локальный wishlist;
  - сохраняется в браузере.

## Компоненты

- `components/layout/StoreLayout.tsx`
  - общий header/footer магазина;
  - поиск;
  - переключение языка;
  - light/dark mode;
  - кнопки cart/wishlist/profile/logout.

- `components/common/ProductCard.tsx`
  - карточка товара;
  - показывает скидку в процентах;
  - add to cart;
  - wishlist;
  - переход на detail page.

- `components/product/ProductGallery.tsx`
  - галерея товара;
  - маленькие фото слева переключают главное фото.

- `components/home/HeroProductSlider.tsx`
  - Swiper hero slider.

- `components/common/CountdownTimer.tsx`
  - таймер акции.

- `components/common/LogoutButton.tsx`
  - кнопка выхода.

- `components/common/ServiceFeatures.tsx`
  - блок сервисных преимуществ.

## Авторизация

Логин идет через:

```text
POST /Account/login
```

Регистрация:

```text
POST /Account/register
```

После входа API возвращает JWT. Токен сохраняется в `localStorage`, а `axiosRequest` автоматически добавляет его в protected запросы.

Если у пользователя есть роль `Admin` или `SuperAdmin`, он может открыть админку.

## Wishlist и Cart

Wishlist сделан локально, потому что в API нет отдельного wishlist endpoint.

Cart защищен:

- если user не вошел, при попытке добавить товар его перекидывает на login;
- если user вошел, товар добавляется в корзину.

## Переводы

Переводы лежат в:

```text
src/i18n/index.ts
```

Есть два языка:

- EN
- RU

Переключение языка находится в header.

## Dark / Light mode

Тема хранится в `localStorage`.

В `index.css` используется custom variant:

```css
@custom-variant dark (&:where(.dark-mode, .dark-mode *));
```

Компоненты адаптированы под dark mode через Tailwind классы.

## AOS animation

AOS подключен в `StoreLayout`.

Используется для плавного появления блоков и карточек:

```tsx
data-aos="fade-up"
```

## Старая админка внутри магазина

Файл:

```text
src/pages/admin/AdminPage.tsx
```

Возможности:

- dashboard;
- products;
- add/edit/delete product;
- multi image upload;
- categories;
- brands;
- colors;
- sub-categories;
- users;
- roles;
- local banners.

## Отдельная админка admin2

Новая админка вынесена как отдельный Vite проект:

```text
C:\Users\David\OneDrive\Рабочий стол\admin2
```

Запуск:

```bash
cd "C:\Users\David\OneDrive\Рабочий стол\admin2"
npm install
npm run dev
```

Адрес:

```text
http://127.0.0.1:5174/login
```

В `admin2` есть:

- отдельный login page;
- dashboard;
- chart;
- top products;
- products;
- add/edit/delete product;
- multi image upload;
- categories add/edit/delete;
- brands add/edit/delete;
- users;
- roles.

## Backend

Основной backend:

```text
https://fastcard-1-o23z.onrender.com/api
```

Главные группы API:

- `Account`
- `Product`
- `Brand`
- `Category`
- `Color`
- `SubCategory`
- `UserProfile`

## Что важно помнить

- `.env` не должен попадать в публичный репозиторий, если там приватные ключи.
- `node_modules` не коммитится.
- `dist` не нужен на этапе разработки.
- API может быть медленным, потому что backend на Render.
- Некоторые order/banner данные в старой админке локальные, потому что в swagger нет полноценного order/banner API.
