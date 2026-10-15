# Secure Task Manager

A full-stack task management app with JWT authentication and a per-user audit log.

## Stack

**Backend:** Java 17 · Spring Boot 3.2 · Spring Security 6 · JPA · MySQL 8 · JJWT 0.12
**Frontend:** React 18 · TypeScript · Redux Toolkit · React Router 6 · Axios · Vite

## Features

- JWT-based stateless authentication (BCrypt password hashing)
- Per-user task isolation (users only see their own data)
- Full CRUD for tasks
- Audit log recording `USER_REGISTERED`, `USER_LOGGED_IN`, `TASK_CREATED`, `TASK_UPDATED`, `TASK_DELETED`
- Global exception handler returning clean JSON errors
- Protected routes on the frontend with persisted session in `localStorage`
- Axios interceptors for token injection and 401 handling

## Project Structure

```text
secure-task-manager/
├── backend/                  # Spring Boot API
│   ├── .env.example          # Template for required environment variables
│   └── src/main/java/com/example/securetaskmanager/
│       ├── config/           # SecurityConfig, ApplicationConfig
│       ├── controller/       # Auth, Task, AuditLog, GlobalExceptionHandler
│       ├── dto/              # Request/response DTOs
│       ├── entity/           # User, Task, AuditLog
│       ├── repository/       # Spring Data JPA repositories
│       ├── security/         # JwtService, JwtAuthenticationFilter, CustomUserDetailsService
│       └── service/          # AuthService, TaskService, AuditLogService
└── frontend/                 # React + Vite SPA
    └── src/
        ├── api/              # axiosClient + auth/task/audit API modules
        ├── app/              # Redux store + typed hooks
        ├── components/       # Navbar, ProtectedRoute, TaskForm, TaskItem
        ├── features/         # authSlice, taskSlice, auditSlice
        └── pages/            # Login, Register, Tasks, AuditLog
```

## Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8 running locally

## Getting Started

### 1. Database

The backend creates the `secure_task_manager` database automatically if it doesn't exist
(`createDatabaseIfNotExist=true`). If you prefer to create it yourself:

```sql
CREATE DATABASE secure_task_manager;
```

Tables are auto-created by Hibernate (`spring.jpa.hibernate.ddl-auto=update`).

### 2. Backend

The backend reads its secrets from environment variables. **It will not start without
`DB_PASSWORD` and `JWT_SECRET_KEY`.**

```bash
cd backend
cp .env.example .env
```

Edit `.env` and fill in your values:

| Variable               | Required | Default                 | Description                                   |
|------------------------|----------|-------------------------|-----------------------------------------------|
| `DB_PASSWORD`          | Yes      | none                    | MySQL password                                |
| `JWT_SECRET_KEY`       | Yes      | none                    | Base64-encoded 256-bit key                    |
| `DB_USERNAME`          | No       | `root`                  | MySQL username                                |
| `JWT_EXPIRATION`       | No       | `86400000` (24 h)       | Token lifetime in milliseconds                |
| `CORS_ALLOWED_ORIGINS` | No       | `http://localhost:3000` | Comma-separated list of allowed frontend URLs |

Generate a JWT secret with:

```bash
openssl rand -base64 32
```

Then start the API **from inside the `backend/` folder** (the `.env` file is loaded relative
to where you run the command):

```bash
mvn spring-boot:run
```

The API runs on http://localhost:8080.

> `.env` is git-ignored. Never commit it. Real environment variables work too, so in
> production you can set them in your hosting platform instead of using a file.

### 3. Frontend

```bash
cd frontend
cp .env.example .env   # optional: only needed if the API is not at http://localhost:8080
npm install
npm run dev
```

The app runs on http://localhost:3000.

To create a production build:

```bash
npm run build
```

### 4. Try it

1. Open http://localhost:3000
2. Register a new account
3. Add, toggle, and delete tasks
4. Click **Audit Log** to see your activity history

## API Endpoints

| Method | Path                      | Auth | Description                    |
|--------|---------------------------|------|--------------------------------|
| POST   | `/api/auth/register`      | No   | Create account, returns JWT    |
| POST   | `/api/auth/authenticate`  | No   | Log in, returns JWT            |
| GET    | `/api/tasks`              | Yes  | List current user's tasks      |
| POST   | `/api/tasks`              | Yes  | Create task                    |
| PUT    | `/api/tasks/{id}`         | Yes  | Update task (must own it)      |
| DELETE | `/api/tasks/{id}`         | Yes  | Delete task (must own it)      |
| GET    | `/api/logs`               | Yes  | Current user's audit history   |

All protected endpoints expect the header `Authorization: Bearer <token>`.

## Security Notes

- Passwords are hashed with BCrypt.
- Secrets (database password, JWT key) are never stored in the repository; they are supplied
  through environment variables.
- The JWT secret must be a Base64-encoded 256-bit key (generate one with `openssl rand -base64 32`).
- Tokens are stateless; the session policy is `STATELESS`.
- Users are scoped to their own data at the service layer, not just the controller.
- The token is stored in `localStorage` for simplicity. This is convenient but readable by any
  script running on the page, so a production deployment should consider `HttpOnly` cookies
  and a strict Content Security Policy.

## License

MIT
