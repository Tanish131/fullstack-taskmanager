# Task Manager - Full Stack App

A full-stack Task Manager application built with **React** (frontend) and **Node.js/Express** (backend), designed for a complete Jenkins DevOps pipeline.

## Project Structure

```
fullstack-taskmanager/
├── backend/          # Node.js + Express REST API
│   ├── src/
│   │   ├── app.js
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── utils/
│   └── tests/
└── frontend/         # React + Vite SPA
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── context/
    │   └── services/
    └── tests/
```

## Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev       # runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev       # runs on http://localhost:5173
```

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET  | /api/auth/profile | Get profile |
| GET  | /api/tasks | List tasks |
| POST | /api/tasks | Create task |
| PUT  | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
| GET  | /api/tasks/stats | Task statistics |
| GET  | /health | Health check |
| GET  | /metrics | Prometheus metrics |

## Testing

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

## Pipeline Stages (Jenkins)
1. Build — npm install + docker build
2. Test — Jest unit + integration tests
3. Code Quality — ESLint + SonarQube
4. Security — npm audit + Trivy
5. Deploy — Docker Compose to staging
6. Release — Tag + promote to production
7. Monitoring — Prometheus + Grafana
