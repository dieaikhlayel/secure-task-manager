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
secure-task-manager/
├── backend/ # Spring Boot API
│ └── src/main/java/com/example/securetaskmanager/
│ ├── config/ # SecurityConfig, ApplicationConfig
│ ├── controller/ # Auth, Task, AuditLog, GlobalExceptionHandler
│ ├── dto/ # Request/response records
│ ├── entity/ # User, Task, AuditLog
│ ├── repository/ # Spring Data JPA repositories
│ ├── security/ # JwtService, JwtAuthenticationFilter, CustomUserDetailsService
│ └── service/ # AuthService, TaskService, AuditLogService
└── frontend/ # React + Vite SPA
└── src/
├── api/ # axiosClient + auth/task/audit API modules
├── app/ # Redux store + typed hooks
├── components/ # Navbar, ProtectedRoute, TaskForm, TaskItem
├── features/ # authSlice, taskSlice, auditSlice
└── pages/ # Login, Register, Tasks, AuditLog

text

## Prerequisites

- Java 17+
- Maven 3.8+ (or use the bundled `./mvnw`)
- Node.js 18+
- MySQL 8 running locally

## Getting Started

### 1. Database

```sql
CREATE DATABASE secure_task_manager;
Tables are auto-created by Hibernate (spring.jpa.hibernate.ddl-auto=update).

2. Backend
bash
cd backend
# edit src/main/resources/application.properties with your MySQL creds
./mvnw spring-boot:run
API runs on http://localhost:8080.

3. Frontend
bash
cd frontend
npm install
npm run dev
App runs on http://localhost:3000.

4. Try it
Open http://localhost:3000

Register a new account

Add / toggle / delete tasks

Click Audit Log to see your activity history

API Endpoints
Method	Path	Auth	Description
POST	/api/auth/register	No	Create account, returns JWT
POST	/api/auth/authenticate	No	Login, returns JWT
GET	/api/tasks	Yes	List current user's tasks
POST	/api/tasks	Yes	Create task
PUT	/api/tasks/{id}	Yes	Update task (must own it)
DELETE	/api/tasks/{id}	Yes	Delete task (must own it)
GET	/api/logs	Yes	Current user's audit history
All protected endpoints expect Authorization: Bearer <token>.

Security Notes
Passwords hashed with BCrypt.

JWT secret must be a Base64-encoded 256-bit key (openssl rand -base64 32).

Tokens are stateless; session policy is STATELESS.

Users are scoped to their own data at the service layer, not just the controller.

License
MIT

text

---

## 6. `docs/api-endpoints.md`

A detailed endpoint reference (optional but nice if anyone else touches the repo).

```markdown
# API Endpoints

Base URL: `http://localhost:8080`

## Auth

### POST /api/auth/register
Body:
```json
{ "username": "alice", "password": "secret123" }
Response 201:

json
{ "token": "eyJhbGci...", "username": "alice" }
POST /api/auth/authenticate
Body:

json
{ "username": "alice", "password": "secret123" }
Response 200:

json
{ "token": "eyJhbGci...", "username": "alice" }
Tasks (protected — requires Authorization: Bearer <token>)
Method	Path	Body	Response
GET	/api/tasks	—	[{ id, description, completed }]
POST	/api/tasks	{ "description": "Buy milk", "completed": false }	201 + task
PUT	/api/tasks/{id}	{ "description": "…", "completed": true }	task
DELETE	/api/tasks/{id}	—	204
Audit Log (protected)
GET /api/logs
Response 200:

json
[
  { "id": 4, "username": "alice", "action": "TASK_CREATED", "details": "Task #3", "timestamp": "2025-01-01T10:15:30" }
]
Error Format
All errors follow this shape:

json
{
  "timestamp": "2025-01-01T10:15:30",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": { "username": "Username is required" }
}
Codes: 400 validation, 401 bad credentials/missing token, 404 not found, 500 unexpected.

text

---

## 7. Update root `.gitignore`

Make sure these are ignored (append if missing):

```bash
cat >> .gitignore << 'EOF'

# Env files
.env
.env.local
*.env.local

# Vite
frontend/.vite/
frontend/dist/
EOF
Verify the Whole Project
bash
# Backend
cd backend && ./mvnw spring-boot:run
# → starts on :8080, creates tables in MySQL

# Frontend (new terminal)
cd frontend && npm run dev
# → starts on :3000
Walk through: register → add task → toggle → delete → check audit log → logout → login again. Everything should work.

