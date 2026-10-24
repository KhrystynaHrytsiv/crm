# CRM Programming School

CRM для обліку та обробки заявок студентів на курси.

- **Backend:** Node.js, Express 5, TypeScript, MongoDB (Mongoose), JWT
- **Frontend:** Next.js 16 (React 19), Redux Toolkit, react-hook-form
- **Спільний код:** папка `shared/` (інтерфейси та joi-валідатори) використовується і бекендом, і фронтендом

## Структура

```
crm/
├── backend/        # REST API (порт 4000)
├── frontend/       # Next.js застосунок (порт 3000)
├── shared/         # спільні інтерфейси та валідатори
├── .env.example    # приклад змінних середовища
├── crm.postman_collection.json
└── docker-compose.yaml
```

## Вимоги

| Інструмент | Версія |
|---|---|
| Node.js | 24.x (перевірено на 24.15.0) |
| npm | 11.x |
| MongoDB | хмарний кластер MongoDB Atlas (або будь-який MongoDB 7+) |
| Docker (опційно) | Docker Desktop / Docker Engine з `docker compose` |

## База даних

Використовується одна БД — **MongoDB** (кластер Atlas). Дані заявок мають документну структуру, коментарі та токени
зберігаються в окремих колекціях, тому друга (реляційна) БД не потрібна.

Колекції: `orders`, `users`, `comments`, `tokens`.

### Заливка дампу

Дамп: https://github.com/OktenSchool/dumps/blob/main/final/orders.dump

```bash
mongorestore --uri="<MONGO_URI>" --archive=orders.dump
```

Під час першого старту бекенд автоматично:
- створює суперадміна `admin@gmail.com` / `admin` (якщо його ще немає);
- проставляє числовий `id` (1, 2, 3, ...) заявкам, у яких його немає (у порядку імпорту).

## Змінні середовища

Скопіюйте `.env.example` у `.env` у **корені** проєкту і заповніть значення:

```bash
cp .env.example .env
```

| Змінна | Опис |
|---|---|
| `MONGO_URI` | рядок підключення до MongoDB |
| `PORT` | порт бекенду (`4000`) |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | секрети access/refresh токенів |
| `JWT_ACCESS_LIFETIME`, `JWT_REFRESH_LIFETIME` | час життя токенів (`1h`, `90m`) |
| `JWT_ACTIVATE_SECRET`, `JWT_RECOVERY_SECRET` | секрети токенів активації / відновлення пароля |
| `JWT_ACTIVATE_LIFETIME`, `JWT_RECOVERY_LIFETIME` | час життя посилань активації (`30m`) |
| `FRONTEND_URL` | адреса фронтенду, з якої генеруються посилання активації (`http://localhost:3000`) |

Фронтенд (опційно): `NEXT_PUBLIC_API_URL` — адреса API, за замовчуванням `http://localhost:4000`.

## Запуск локально (без Docker)

Усі команди виконуються з кореня проєкту.

1. Встановити залежності (корінь — для `shared/`, потім бекенд і фронтенд):

   ```bash
   npm install
   ```
   ```bash
   npm install --prefix backend
   ```
   ```bash
   npm install --prefix frontend
   ```

2. Запустити бекенд (в окремому терміналі):

   ```bash
   cd backend && npm start
   ```

   У консолі з'явиться `server listen 4000 port`.

3. Запустити фронтенд (в іншому терміналі):

   ```bash
   cd frontend && npm run dev
   ```

4. Відкрити http://localhost:3000 і увійти як `admin@gmail.com` / `admin`.

## Запуск через Docker

1. Створити `.env` у корені (див. вище).
2. Зібрати та запустити:

   ```bash
   docker compose up --build
   ```

3. Фронтенд: http://localhost:3000, API: http://localhost:4000.

## Документація API

- **Swagger UI:** http://localhost:4000/docs (доступний після запуску бекенду)
- **Postman:** імпортуйте `crm.postman_collection.json`, створіть змінну `baseUrl = http://localhost:4000`.
  Після запиту `login` підставте отримані токени у змінні `accessToken` / `refreshToken`.

Основні ендпоінти:

| Метод | Шлях | Доступ | Опис |
|---|---|---|---|
| POST | `/auth/login` | публічний | логін, повертає `user` і `tokens` |
| POST | `/auth/refresh` | refresh token | нова пара токенів |
| POST | `/auth/logout` | refresh token | вихід |
| GET | `/auth/me` | access token | поточний користувач |
| GET | `/orders` | access token | заявки (25 на сторінку), фільтри та сортування через query |
| GET | `/orders/excel` | access token | Excel-файл заявок за тими ж фільтрами |
| GET | `/orders/groups` | access token | список груп |
| GET | `/orders/statistics` | access token | статистика заявок за статусами |
| PUT | `/orders/:orderId` | access token, своя/нічия заявка | редагування заявки |
| GET | `/orders/:orderId/comments` | access token | коментарі заявки |
| POST | `/orders/:orderId/comments` | access token, своя/нічия заявка | додати коментар (заявка закріплюється за користувачем) |
| GET | `/manager?page=1` | admin | менеджери зі статистикою (10 на сторінку) |
| POST | `/manager` | admin | створити менеджера |
| GET | `/manager/:id/activate` \| `/manager/:id/recovery` | admin | посилання активації / відновлення пароля (30 хв) |
| PATCH | `/manager/:id/ban` \| `/manager/:id/unban` | admin | заблокувати / розблокувати |
| POST | `/manager/:action/:token` | публічний | встановити пароль за посиланням |

Query-параметри `/orders`: `page`, `order` (`id`, `-id`, `name`, `-created_at`, ...), `name`, `surname`, `email`, `phone`
(пошук підрядка без урахування регістру), `age`, `course`, `course_format`, `course_type`, `status`, `group`,
`start_date`, `end_date` (`YYYY-MM-DD`), `my=true` (тільки заявки поточного користувача).
