# OpsMind AI

> AI-powered DevOps operations and infrastructure intelligence platform.

OpsMind AI helps teams monitor infrastructure health, track operational risk, manage alerts, and collaborate with an AI assistant that understands the current environment context.

## Why OpsMind AI?

Modern operations teams need visibility across projects, environments, services, and alerts without jumping between tools. OpsMind AI brings together:

- infrastructure and environment management
- live monitoring and operational metrics
- alert lifecycle tracking and acknowledgements
- AI-powered analysis for incidents and recommendations
- secure authentication and protected API access
- a unified dashboard for DevOps workflows

## Core features

- Infrastructure and environment management
- Resource and service monitoring
- Automated alert generation based on thresholds
- Alert acknowledgement and resolution flow
- Notification tracking for unread and active alerts
- AI assistant for operational context and recommendations
- JWT-based authentication and protected endpoints
- Password hashing with secure backend practices
- MongoDB Atlas-ready persistence layer
- React + TypeScript dashboard experience
- FastAPI backend with REST API structure
- Dark, operations-focused UI design

## Architecture

```text
                           ┌─────────────────────────────┐
                           │       OpsMind AI           │
                           │       Web Dashboard         │
                           └──────────────┬──────────────┘
                                          │
                                          │ HTTPS / REST
                                          ▼
                           ┌─────────────────────────────┐
                           │      FastAPI Backend        │
                           │                             │
                           │ - Auth                     │
                           │ - Projects                 │
                           │ - Environments             │
                           │ - Services                 │
                           │ - Monitoring               │
                           │ - Alerts                   │
                           │ - Notifications            │
                           │ - AI Assistant             │
                           └──────────────┬──────────────┘
                                          │
                     ┌────────────────────┼────────────────────┐
                     ▼                    ▼                    ▼
              ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
              │ MongoDB      │    │ Gemini AI    │    │ Frontend     │
              │ Atlas /      │    │ Assistant    │    │ Dashboard    │
              │ Local Mongo  │    │              │    │              │
              └──────────────┘    └──────────────┘    └──────────────┘
```

## Tech stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- React Markdown
- Lucide React

### Backend

- Python
- FastAPI
- Pydantic
- MongoDB / Motor
- JWT
- Passlib
- Bcrypt

### AI

- Google Gemini
- Infrastructure context analysis
- Operational risk review
- Alert triage and guidance
- AI-generated recommendations

## Current modules

### Dashboard

A high-level overview of the platform with operational metrics such as:

- infrastructure counts
- service counts
- active alerts
- API health
- environment status
- quick operational actions

### Infrastructure

Manage:

- projects
- environments
- resources
- services

### Monitoring

Track infrastructure measures such as:

- CPU usage
- memory usage
- disk usage
- response time
- health status

### Alerts

OpsMind AI can detect and track operational alerts based on thresholds, including:

- high CPU usage
- high memory usage
- high disk usage
- high response time

Alert states include:

- active
- acknowledged
- resolved

### AI Assistant

The assistant can review current infrastructure context and support:

- infrastructure analysis
- active incident review
- operational risk identification
- recent alert summaries
- recommended next steps

It is designed to provide recommendations, not to claim actions were completed unless the system confirms them.

### Authentication

The platform includes:

- signup and login flows
- password hashing
- JWT access tokens
- protected API endpoints
- user roles and account status tracking

## Repository structure

```text
OpsMind-AI/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── services/
│   ├── .env
│   ├── requirements.txt
│   └── venv/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.ts
├── infrastructure/
├── docs/
├── .gitignore
├── README.md
├── requirements.txt
├── atlas-credentials.env
└── .git/
```

> Sensitive files such as `.env`, credentials, virtual environments, `node_modules`, and generated build output are intentionally excluded from Git.

## Getting started

### Prerequisites

Before running the project locally, make sure you have:

- Python 3.10+
- Node.js 18+
- npm
- MongoDB instance or MongoDB Atlas access
- Gemini API key for AI features

### Backend setup

From the project root:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create a local environment file:

```text
backend/.env
```

Example configuration:

```env
MONGODB_URL=mongodb://localhost:27017
MONGODB_DATABASE=opsmind_ai
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your-gemini-key
```

Start the API:

```powershell
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Open the API docs:

- http://127.0.0.1:8000/docs
- http://127.0.0.1:8000/health

### Frontend setup

From the project root:

```powershell
cd frontend
npm install
npm run dev
```

The frontend typically runs at:

```text
http://localhost:5173
```

## API overview

The backend includes APIs for:

- authentication
- projects
- environments
- resources
- services
- monitoring
- alerts
- notifications
- AI assistant

FastAPI Swagger is available at:

```text
http://127.0.0.1:8000/docs
```

## Development status

Current implementation includes:

- [x] React-based dashboard
- [x] Infrastructure management
- [x] Monitoring dashboards and metrics
- [x] Alert generation and tracking
- [x] Notifications and unread alert flows
- [x] AI assistant integration
- [x] MongoDB Atlas / MongoDB connectivity
- [x] User signup and login
- [x] JWT authentication
- [x] Protected API endpoints
- [x] Password hashing

## Roadmap

Planned improvements and future work:

- [ ] frontend login and signup screens
- [ ] protected frontend routes
- [ ] user-specific project access
- [ ] role-based authorization
- [ ] richer infrastructure integrations
- [ ] Docker deployment
- [ ] Kubernetes deployment
- [ ] GitHub Actions CI/CD
- [ ] Terraform-based infrastructure automation
- [ ] Prometheus and Grafana integration
- [ ] advanced AI incident analysis
- [ ] automated anomaly detection
- [ ] AI-assisted remediation recommendations
- [ ] broader cloud infrastructure integrations

## Project goal

OpsMind AI aims to become a modern operations intelligence platform that combines infrastructure visibility, real-time monitoring, alert management, secure access control, and AI-driven support into a single operations workspace.

---

Built to support faster operational understanding, better alert response, and smarter infrastructure decisions.
