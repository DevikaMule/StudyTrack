# StudyTrack — Student Study Planner 📚

StudyTrack is a clean, modern, and full-stack study management application designed for students to organize academic subjects, track daily assignments & study tasks, schedule study sessions, and monitor learning progress.

---

## 🚀 Features

- **Interactive Dashboard**:
  - Dynamic metrics: Total Subjects, Total Tasks, Completed Tasks, and Completion Rate %.
  - "Today's Tasks" list view with quick mark-as-complete toggles.
  - "Upcoming Study Sessions" overview.
  - "Recent Subjects" course preview cards.
- **Subjects Management (`/subjects`)**:
  - Full CRUD capabilities (Create, Read, Edit, Delete).
  - Visual progress bar indicator (0–100%).
  - Subject Detail view (`/subjects/:id`) listing associated tasks and scheduled study blocks.
- **Tasks Page (`/tasks`)**:
  - Multi-criteria real-time search (by title, description, or subject).
  - Combined filtering by **Priority** (High, Medium, Low), **Status** (Pending, Completed), and **Subject**.
  - Priority badges, due dates, and completion status toggles with visual strikethrough.
- **Study Planner (`/planner`)**:
  - View scheduled study sessions (All Sessions vs. Upcoming toggle).
  - Filter by date, subject, or completion status.
  - Interactive session creation with topic, date, start time, and duration.
- **Responsive Layout**:
  - Sticky Navbar with profile indicator and mobile menu toggle drawer.
  - Desktop sidebar navigation with active page highlights.
- **Toast Notifications**:
  - Instant visual feedback on data mutations (add, edit, delete, complete).

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios
- **Styling**: Vanilla CSS (Custom Design System with CSS variables, Flexbox & Grid)
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Middleware**: CORS, Express JSON parser, Custom Error Handler
- **Data Storage**: In-Memory JavaScript Arrays (`store.js`)

---

## 📁 Folder Structure

```text
studytrack/
├── backend/
│   ├── data/
│   │   └── store.js              # In-memory arrays (subjects, tasks, sessions)
│   ├── controllers/
│   │   ├── subjectController.js   # Subject CRUD & validation
│   │   ├── taskController.js      # Task CRUD & completion toggle
│   │   ├── sessionController.js   # Session CRUD & completion toggle
│   │   └── dashboardController.js # Dynamic statistics calculation
│   ├── routes/
│   │   ├── subjectRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── sessionRoutes.js
│   │   └── dashboardRoutes.js
│   ├── middleware/
│   │   └── errorHandler.js        # Global error handling middleware
│   ├── server.js                  # Express server entry point (Port 5000)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js             # Centralized Axios instance
│   │   ├── hooks/
│   │   │   └── useFetch.js        # Custom fetch hook
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── SubjectCard.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── StudySessionCard.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── Toast.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Subjects.jsx
│   │   │   ├── SubjectDetails.jsx
│   │   │   ├── Tasks.jsx
│   │   │   └── Planner.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 💻 Getting Started & Running the Application

### 1. Start Backend Server

Navigating into the `backend` directory, install dependencies, and start the development server:

```bash
cd backend
npm install
npm run dev
```

The Express API will run at **`http://localhost:5000`**.

### 2. Start Frontend Server

In a new terminal window, navigate into the `frontend` directory, install dependencies, and start Vite:

```bash
cd frontend
npm install
npm run dev
```

The React frontend will be accessible at **`http://localhost:5173`**.

---

## 📡 REST API Endpoints

### Dashboard
- `GET /api/dashboard` — Returns dynamic metrics summary

### Subjects
- `GET /api/subjects` — Get all subjects
- `GET /api/subjects/:id` — Get single subject by ID
- `POST /api/subjects` — Create new subject
- `PUT /api/subjects/:id` — Update existing subject
- `DELETE /api/subjects/:id` — Delete subject

### Tasks
- `GET /api/tasks` — Get all tasks
- `GET /api/tasks/:id` — Get single task by ID
- `POST /api/tasks` — Create new task
- `PUT /api/tasks/:id` — Update task details
- `DELETE /api/tasks/:id` — Delete task
- `PATCH /api/tasks/:id/complete` — Toggle task completion status

### Study Sessions
- `GET /api/sessions` — Get all study sessions
- `GET /api/sessions/:id` — Get single study session
- `POST /api/sessions` — Create new study session
- `PUT /api/sessions/:id` — Update session details
- `DELETE /api/sessions/:id` — Delete session
- `PATCH /api/sessions/:id/complete` — Toggle session completion status

---

## ⚠️ Known Limitation

> Data is maintained in-memory in `backend/data/store.js`. Any modifications (added/updated/deleted records) will reset to the original sample dataset whenever the Express backend server is restarted.
