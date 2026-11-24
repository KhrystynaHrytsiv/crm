# CRM

CRM система для обліку та обробки заявок студентів на курси.

- **Backend:** Node.js 24, Express 5, TypeScript, MongoDB (Mongoose), JWT
- **Frontend:** Next.js 16 (React 19), Redux Toolkit, react-hook-form
- **Спільний код:** папка `shared/` (інтерфейси та joi-валідатори) використовується і бекендом, і фронтендом

## Структура

```
crm/
├── backend/                  # REST API (порт 4000)
│   ├── .env.example          # змінні середовища бекенду
│   └── Dockerfile
├── frontend/                 # Next.js застосунок (порт 3000)
│   ├── .env.example          # адреса API для фронтенду
│   └── Dockerfile
├── shared/                   # спільні інтерфейси та валідатори
├── crm.postman_collection.json
└── docker-compose.yaml
```

## Вимоги

| Інструмент       | Версія                                            |
|------------------|---------------------------------------------------|
| Node.js          | 24.x (перевірено на 24.15.0)                      |
| npm              | 11.x                                              |
| MongoDB          | кластер MongoDB Atlas або будь-який MongoDB 5.0+  |
| MongoDB Tools    | `mongorestore` — тільки для заливки дампу         |
| Docker (опційно) | Docker Desktop / Docker Engine з `docker compose` |

## База даних

Використовується одна БД — **MongoDB**. Дані заявок мають документну структуру, коментарі, групи та токени зберігаються в окремих колекціях, тому друга (реляційна) БД не потрібна.

Колекції: `orders`, `users`, `comments`, `groups`, `tokens`.

## Налаштування бази даних та заливка дампу

Для роботи проєкту використовується MongoDB Atlas (хмарна база даних) або локально встановлена MongoDB версії 5.0+.

### Створення бази даних у MongoDB Atlas
   1. Зареєструйтеся на MongoDB Atlas.
   2. Створіть новий кластер.
   3. Створіть користувача бази даних (Database User) та встановіть пароль.
   4. У налаштуваннях Network Access дозвольте підключення зі своєї IP-адреси.
   5. Перейдіть у Connect → Drivers та скопіюйте рядок підключення до бази даних. 
### Налаштування підключення
   1. Створіть файл backend/.env на основі backend/.env.example.
   2. Вставте отриманий рядок підключення у змінну MONGO_URI, вказавши назву бази даних.

Наприклад:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/crm
```

Замість username та password вкажіть свої облікові дані.

### Імпорт початкових даних
   1. Скопіюйте дані з файлу дампу https://github.com/OktenSchool/dumps/blob/main/final/orders.dump.
   2. Відкрийте MongoDB Compass або інший інструмент для роботи з MongoDB.
   3. Підключіться до бази даних, використовуючи рядок MONGO_URI.
   4. Вставте дані з дампу у консоль та запустіть команду.

Після імпорту переконайтеся, що в базі даних створилася колекція orders із 500 документами.
Під час кожного старту бекенд автоматично (повторний запуск нічого не ламає):

- створює суперадміна `admin@gmail.com` / `admin`, якщо його ще немає;
- проставляє числовий `id` (1, 2, 3, ...) заявкам без `id` у порядку імпорту.

> ⚠️ Після першого входу в продакшені змініть пароль адміна або обмежте доступ до нього.

## Змінні середовища

### Backend — `backend/.env`

```bash
  cp backend/.env.example backend/.env
```

| Змінна                                                                                  | Обов'язкова | Опис                                                                                  |
|-----------------------------------------------------------------------------------------|-------------|---------------------------------------------------------------------------------------|
| `MONGO_URI`                                                                             | так         | рядок підключення до MongoDB                                                          |
| `PORT`                                                                                  | так         | порт бекенду (`4000`)                                                                 |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_ACTIVATE_SECRET`, `JWT_RECOVERY_SECRET` | так         | секрети токенів: довгі випадкові рядки, різні для кожного (`openssl rand -hex 32`)    |
| `JWT_ACCESS_LIFETIME`, `JWT_REFRESH_LIFETIME`                                           | так         | час життя токенів (`1h`, `90m`)                                                       |
| `JWT_ACTIVATE_LIFETIME`, `JWT_RECOVERY_LIFETIME`                                        | так         | час життя посилань активації / відновлення пароля (`30m`)                             |
| `FRONTEND_URL`                                                                          | так         | публічна адреса фронтенду: дозволений origin для CORS і основа посилань активації     |
| `DNS_SERVERS`                                                                           | ні          | DNS-сервери через кому (8.8.8.8,8.8.4.4), якщо локальний DNS не резолвить mongodb+srv |

Якщо обов'язкової змінної немає, бекенд не стартує і пише в лог, якої саме.

### Frontend — `frontend/.env`

```bash
  cp frontend/.env.example frontend/.env
```

| Змінна                | Опис                                                                                                                                                                                |
|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `NEXT_PUBLIC_API_URL` | публічна адреса бекенду, на яку браузер  запити. За замовчуванням `http://localhost:4000`. Вшивається у збірку під час `npm run build`, тому після зміни фронтенд треба перезібрати |

## Запуск локально (режим розробки)

Усі команди — з кореня проєкту.

1. Залежності для `shared/` (joi, pino):

    ```bash
    npm install
    ```

2. Бекенд (в окремому терміналі):

    ```bash
    cd backend
    ```

    ```bash
    npm install
    ```

    ```bash
    npm run dev
    ```

    У консолі з'явиться `server listen 4000 port`.

3. Фронтенд (в іншому терміналі):

    ```bash
     cd frontend
    ```

    ```bash
     npm install
    ```

    ```bash
     npm run dev
    ```

4. Відкрийте http://localhost:3000 і увійдіть як `admin@gmail.com` з паролем `admin`.


### Запуск через Docker

1. Створіть `backend/.env`. `FRONTEND_URL` — публічна адреса фронтенду.
2. Зібрати та запустити:

   ```bash
   docker compose up --build
   ```

3. Фронтенд: http://localhost:3000, API: http://localhost:4000.


## Документація API

- **Swagger UI:** http://localhost:4000/docs
- **Postman:** імпортуйте `crm.postman_collection.json`, створіть змінну `baseUrl = http://localhost:4000`.
  Після запиту `login` підставте отримані токени у змінні `accessToken` / `refreshToken`.

| Метод | Шлях                                               | Доступ                          | Опис                                                                     |
|-------|----------------------------------------------------|---------------------------------|--------------------------------------------------------------------------|
| POST  | `/auth/login`                                      | публічний                       | логін, повертає `user` і `tokens`                                        |
| POST  | `/auth/refresh`                                    | refresh token                   | нова пара токенів                                                        |
| POST  | `/auth/logout`                                     | refresh token                   | вихід                                                                    |
| GET   | `/auth/me`                                         | access token                    | поточний користувач                                                      |
| GET   | `/orders`                                          | access token                    | заявки (25 на сторінку), фільтри та сортування через query               |
| GET   | `/orders/excel`                                    | access token                    | Excel-файл заявок за тими ж фільтрами та сортуванням                     |
| GET   | `/orders/groups`                                   | access token                    | список груп                                                              |
| POST  | `/orders/groups`                                   | access token                    | створити групу (назва унікальна, без урахування регістру)                |
| GET   | `/orders/statistics`                               | admin                           | кількість заявок за статусами (`new` включає заявки без статусу)         |
| PATCH | `/orders/:orderId`                                 | access token, своя/нічия заявка | редагування заявки; статус `new` звільняє заявку                         |
| GET   | `/orders/:orderId/comments`                        | access token                    | коментарі заявки                                                         |
| POST  | `/orders/:orderId/comments`                        | access token, своя/нічия заявка | коментар; заявка закріплюється за користувачем, `null`/`new` → `in work` |
| GET   | `/manager?page=1`                                  | admin                           | користувачі зі статистикою (10 на сторінку, нові зверху)                 |
| POST  | `/manager`                                         | admin                           | створити менеджера                                                       |
| GET   | `/manager/:id/activate` \| `/manager/:id/recovery` | admin                           | одноразове посилання активації / відновлення пароля (30 хв)              |
| PATCH | `/manager/:id/ban` \| `/manager/:id/unban`         | admin                           | заблокувати / розблокувати                                               |
| GET   | `/manager/isValidToken/:action/:token`             | публічний                       | чи посилання ще дійсне                                                   |
| POST  | `/manager/:action/:token`                          | публічний                       | встановити пароль за посиланням                                          |

Query-параметри `/orders` і `/orders/excel`:

- `page` — номер сторінки;
- `order` — поле сортування, `-` на початку — за спаданням: `id`, `-id`, `name`, `-created_at`, `manager` (за прізвищем менеджера), ...;
- `name`, `surname`, `email`, `phone` — пошук підрядка без урахування регістру;
- `age`, `course`, `course_format`, `course_type`, `status`, `group` — точний збіг;
- `start_date`, `end_date` — дата створення (`YYYY-MM-DD`);
- `manager=true` — тільки заявки поточного користувача (чекбокс **My**).
