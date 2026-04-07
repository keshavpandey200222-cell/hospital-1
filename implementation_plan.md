# Hospital Management System (HMS) Implementation Plan

## Goal Description

Design and develop a production‑ready, scalable Hospital Management System (HMS) that solves real‑world healthcare problems. The system will include patient, doctor, and admin modules, real‑time queue tracking, tele‑medicine, an AI symptom‑checker, and strong security (HIPAA‑like).

## User Review Required

> [!IMPORTANT]
> You have confirmed:
> - **Backend:** Spring Boot (Java)
> - **Database:** PostgreSQL
>
> We still need clarification on the following items before we can generate code:
>
> 1. **Real‑time library** – STOMP over WebSocket (Spring) or plain native WebSocket?
> 2. **Video SDK** – Twilio Video (default), Agora, or Jitsi Meet?
> 3. **AI symptom checker** – rule‑based MVP (default) or direct LLM integration now?
> 4. **Cloud provider** – AWS (default), Azure, GCP, or self‑hosted?
> 5. **Docker** – Full containerization from the start (default) or postpone?
>
> Please reply with your choices.

## Proposed Changes (already decided)

### 1. Project Structure
#### Backend (Spring Boot)
```
backend/
 ├─ src/main/java/com/hms/
 │   ├─ domain/          # Entity classes (Patient, Doctor, Appointment, …)
 │   ├─ application/     # Service / use‑case layer
 │   ├─ infrastructure/
 │   │   ├─ persistence/ # Spring Data JPA repositories
 │   │   ├─ messaging/   # WebSocket / STOMP config
 │   │   └─ external/    # Email, SMS, S3, AI client adapters
 │   ├─ api/
 │   │   ├─ controller/  # REST controllers
 │   │   └─ dto/         # Request/Response DTOs
 │   ├─ config/          # JWT, security, env config
 │   ├─ security/        # JWT utils, BCrypt, RBAC filters
 │   └─ exceptions/      # Global exception handling
 ├─ src/main/resources/
 │   ├─ application.yml  # Spring Boot config (DB, JWT, etc.)
 │   └─ schema.sql       # Initial PostgreSQL schema
 └─ pom.xml               # Maven dependencies (Spring Boot, JPA, WebSocket, Lombok, etc.)
```

#### Frontend (Next.js + Tailwind)
```
frontend/
 ├─ pages/
 │   ├─ index.tsx
 │   ├─ login.tsx
 │   ├─ dashboard/
 │   │   ├─ patient/
 │   │   ├─ doctor/
 │   │   └─ admin/
 ├─ components/          # UI primitives (Card, Modal, Table, Chart)
 ├─ hooks/               # useAuth, useWebSocket, useFetch
 ├─ services/            # Axios instance with JWT interceptor
 ├─ store/               # Context API (or Redux Toolkit) for global state
 ├─ styles/              # Tailwind config + global CSS
 ├─ public/              # Images, icons
 └─ next.config.js
```

### 2. Database Schema (PostgreSQL)
*(SQL DDL will be generated in `backend/src/main/resources/schema.sql`)*
Key tables: `users`, `patients`, `doctors`, `appointments`, `prescriptions`, `lab_results`, `beds`, `billings`, `audit_logs`, plus materialized views for analytics.

### 3. Core API Endpoints (REST) – same as in the original plan, implemented with Spring MVC.

### 4. Real‑time Queue
- **STOMP over WebSocket** endpoint: `/ws/queue`
- Server broadcasts `queueUpdate`, `tokenAssigned`, `priorityAlert`.

### 5. Notification Service
- Interface `NotificationProvider` with implementations for Email (SMTP), SMS (Twilio), WhatsApp (Twilio/Meta).

### 6. Tele‑medicine
- Integration point for **Twilio Video** (or alternative you choose). Backend creates a session token, frontend embeds the Twilio Video component.

### 7. AI Symptom Checker
- Simple rule‑based engine (`symptom_rules.json`) in the backend; later replace with OpenAI LLM call.

### 8. Security
- HTTPS enforced via reverse proxy (Nginx in Docker).
- JWT signed with RSA keys, short expiry, refresh‑token flow.
- BCrypt password hashing (12 rounds).
- Input validation with **Hibernate Validator** annotations.
- Role‑based access control via Spring Security.
- Audit logging (`audit_logs` table).

### 9. DevOps / Deployment
- **Dockerfile** for backend and frontend.
- `docker-compose.yml` for local development (PostgreSQL, Redis, API, UI).
- GitHub Actions CI pipeline builds Docker images, runs tests, pushes to Docker Hub / AWS ECR.
- Deploy to **AWS ECS/Fargate** + **RDS PostgreSQL** (or alternative cloud you pick).
- Environment variables managed via `.env` files and secret manager.

## Verification Plan
- **Automated tests**: JUnit + Spring Test for backend services, Cypress for end‑to‑end UI flows.
- **Manual checks**: Run `docker-compose up`, verify registration, login, appointment booking, real‑time queue updates, notification delivery, and a mock video call.

---

*Once you confirm the remaining choices, we will create the project skeletons, database migrations, and initial API implementations.*

