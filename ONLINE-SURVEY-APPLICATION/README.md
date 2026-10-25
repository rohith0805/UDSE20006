# Online Survey Application

A full-stack survey app built with React, Vite, Node.js, Express, and MongoDB.

## Features
- Each participant gets five randomly selected, unique questions.
- Multiple-choice and short-answer questions.
- Frontend and backend validation require all five answers.
- Admin panel to add/delete questions and view the latest 200 submissions.
- Stores question snapshots and responses in MongoDB.
- Responsive layout for desktop and mobile.

## Requirements
- Node.js 20 or newer recommended
- MongoDB running locally, or a MongoDB Atlas connection string
- npm

## 1. Configure the backend

Open a terminal in `ONLINE-SURVEY-APPLICATION/backend`:

```powershell
npm install
Copy-Item .env.example .env
```

Edit `backend/.env` and set `MONGODB_URI`. For a local MongoDB install, the default is:

```env
PORT=5002
MONGODB_URI=mongodb://127.0.0.1:27017/online_survey
CLIENT_URL=http://localhost:5175
ADMIN_KEY=replace-this-with-a-long-unique-secret
```

Do not publish your `.env` file or share your admin key. The backend refuses admin operations while the default placeholder key remains.

Create sample questions (after MongoDB is running):

```powershell
npm run seed
```

Start the backend:

```powershell
npm run dev
```

The API runs at `http://localhost:5002`.

## 2. Configure the frontend

Open a second terminal in `ONLINE-SURVEY-APPLICATION/frontend`:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Open `http://localhost:5175`.

## 3. Use the app
1. Open the frontend. The app loads five random questions from the question bank.
2. Answer all five and select **Submit survey**.
3. To manage the question bank, choose **Admin panel** in the header.
4. Enter the exact `ADMIN_KEY` from `backend/.env`.
5. Add/delete questions or expand a recent response to review its answers.

At least five questions must exist for a survey to start. Run `npm run seed` once to add example questions. It will not overwrite an existing question bank.

## API routes
| Method | Route | Purpose |
|---|---|---|
| GET | `/api/questions/random` | Fetch five random questions |
| GET | `/api/questions` | List questions (admin key required) |
| POST | `/api/questions` | Add a question (admin key required) |
| DELETE | `/api/questions/:id` | Delete a question (admin key required) |
| POST | `/api/surveys` | Validate and save a five-answer response |
| GET | `/api/admin/responses` | List recent responses (admin key required) |

Admin routes require the `x-admin-key` HTTP header.

## Notes
- The simple shared admin key is suitable for a classroom/demo project, not a production deployment. A production system should use proper administrator accounts, hashed credentials, sessions or short-lived tokens, rate limiting, and HTTPS.
- Responses are stored without a participant name or email by default.
- The question bank uses MongoDB `$sample` to select questions randomly. Each question is unique within a survey.
