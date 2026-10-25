# Project Management Dashboard

Full-stack project management dashboard using React, Node.js, Express, and MongoDB.

## Features
- Add tasks with title, description, assignee, priority, and due date
- View task totals and status columns
- Change task status among Pending, In Progress, and Completed
- Edit task details and delete tasks
- Search tasks and filter by status
- MongoDB persistence

## Requirements
- Node.js 20+
- MongoDB Community Server running locally, or MongoDB Atlas

## Backend setup
Open a terminal in `backend`:
```powershell
npm install
```
Copy `.env.example` to `.env` and configure `MONGO_URI`.
```powershell
npm run dev
```
Backend: `http://localhost:5001`

## Frontend setup
Open a second terminal in `frontend`:
```powershell
npm install
```
Copy `.env.example` to `.env`.
```powershell
npm run dev
```
Open the Vite URL, usually `http://localhost:5174`.

## Project structure
```text
PROJECT-MANAGEMENT-SYSTEM/
├── backend/
│   ├── config/db.js
│   ├── models/Task.js
│   ├── routes/taskRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/Navbar.jsx
    │   ├── components/TaskCard.jsx
    │   ├── components/TaskForm.jsx
    │   ├── App.jsx
    │   ├── api.js
    │   ├── main.jsx
    │   └── style.css
    ├── .env.example
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## API endpoints
- `GET /api/tasks` — list tasks; supports `?status=pending` and `?search=keyword`
- `GET /api/tasks/stats` — status totals
- `POST /api/tasks` — create task
- `PATCH /api/tasks/:id` — update task fields/status
- `DELETE /api/tasks/:id` — delete task

## Default task statuses
`Pending`, `In Progress`, `Completed`

If you use local MongoDB, ensure its service is running before starting the backend.
