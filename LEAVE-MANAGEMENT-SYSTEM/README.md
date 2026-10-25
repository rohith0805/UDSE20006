# Leave Management System (React + Node.js + Express + MongoDB)

A beginner-friendly full-stack project with employee registration/login, casual and medical leave applications, leave balance tracking, leave history, and admin approval/rejection.

## Requirements
- Node.js 20+
- MongoDB Community Server running locally, or a MongoDB Atlas connection string
- VS Code

## Project structure
```text
leave-management-system/
├── backend/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/User.js
│   ├── models/Leave.js
│   ├── routes/authRoutes.js
│   ├── routes/leaveRoutes.js
│   ├── routes/adminRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/Navbar.jsx
    │   ├── pages/Login.jsx
    │   ├── pages/Register.jsx
    │   ├── pages/Dashboard.jsx
    │   ├── pages/ApplyLeave.jsx
    │   ├── pages/LeaveHistory.jsx
    │   ├── pages/AdminDashboard.jsx
    │   ├── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── style.css
    ├── .env.example
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## 1. Set up MongoDB
Start your local MongoDB service, or create a database in MongoDB Atlas.

## 2. Start the backend
Open a terminal in `backend`:
```bash
npm install
```
Copy `.env.example` to `.env`, then set `MONGO_URI` and `JWT_SECRET`.
```bash
npm run dev
```
The API runs at `http://localhost:5000`.

To make the first registered user an administrator, set `ADMIN_EMAIL` in `.env` to the email you will register with. Register using that exact email. Other users are employees.

## 3. Start the frontend
Open a second terminal in `frontend`:
```bash
npm install
```
Copy `.env.example` to `.env`.
```bash
npm run dev
```
Open the local URL printed by Vite, usually `http://localhost:5173`.

## Features
- Register and log in with JWT authentication
- Employee dashboard with Casual Leave and Medical Leave balances
- Apply for leave with dates and reason
- Prevent overlapping leave requests
- Prevent requests that exceed the available balance
- View own leave history and status
- Admin dashboard to approve/reject pending requests
- Approved requests deduct from the balance; rejected requests do not

## Default leave balance
Each new employee starts with 12 Casual Leave days and 10 Medical Leave days. Adjust the defaults in `backend/models/User.js` to match your organization.

## Important notes
- This is a learning/demo project. Before production use, add password reset, email verification, audit logs, stronger validation, rate limiting, and organization-specific leave policies.
- Dates are counted inclusively, so a leave from Monday through Wednesday is 3 days.
- Admin accounts are assigned by matching `ADMIN_EMAIL` at registration. Keep the `.env` value private and do not expose it in the frontend.
