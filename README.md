# Campus HQ — Hostel & Mess Management System

A production-grade, enterprise-ready dashboard application for college campuses. It simplifies hostel room issue reporting, complaint resolution tracking, daily/weekly mess menu display, meal ratings, and mess satisfaction analytics.

Developed with **Spring Boot** (Java 21) on the backend and **React** (Vite + TailwindCSS v4) on the frontend.

---

## 🚀 Key Features

### 🔒 1. Authentication & Role-Based Access Control (RBAC)
- Register & Login with automatic role-based routing.
- Protected client-side routes and secure server-side endpoint guards.
- JWT stateless session management.

### 🛠️ 2. Room Issue Reporting & Resolution Pipeline
- Students can file complaints with title, description, category (electrical, plumbing, wifi, furniture, etc.), priority level, and an **optional image upload**.
- Automatic routing of complaints to the Warden assigned to the student's hostel block.
- 5-stage status lifecycle: `Pending ➔ In Review ➔ In Progress ➔ Resolved` or `Escalated`.
- Audit log (timeline tracker) recording every status update, note, and editor.
- Embedded comments thread supporting communication between the student and warden.

### 🍴 3. Mess Menu & Meal Feedback
- Weekly 7-day meal matrix (Breakfast, Lunch, Dinner).
- 1–5 star rating system for each meal with optional comment feedback.
- Food quality complaint filing system for direct reporting to the Mess Committee.
- Automatic prevention of duplicate ratings per day.

### 📊 4. Admin Analytics Dashboard
- Overall KPI summaries: total/pending/resolved/escalated complaints count, average resolution time (hours), and overall mess satisfaction rating.
- Recharts visualizations:
  - Pie chart representing distribution of complaints by status.
  - Horizontal bar chart showcasing complaints by category.
  - Trend line tracking average mess satisfaction ratings over the last 30 days.
- Admin management tools: assign Wardens to Hostel Blocks, edit the weekly meal slots.

### 🎨 5. Glassmorphic UI with Light & Dark Themes
- High-fidelity frosted-glass components, subtle gradients, and custom modern typography (`Geist` Google Font).
- Fully responsive sidebar layout.
- Clean system-wide status badges.
- Persistent choice of Dark/Light theme in local storage.

---

## 🛠️ Tech Stack & Prerequisites

- **Backend**: Java 21, Spring Boot 3.4, Spring Security 6, Spring Data JPA, H2 Database (or MySQL), JJWT.
- **Frontend**: React 18, Vite, TailwindCSS v4, Axios, React Router, Recharts, Lucide icons.
- **Prerequisites**: Node.js v20+ and Maven 3.9+.

---

## ⚙️ Running Locally

### 1. Start the Backend
1. Open a terminal in `backend/`.
2. Run the application:
   ```bash
   mvn spring-boot:run
   ```
3. The server will start on [http://localhost:8080](http://localhost:8080).
4. The database is initialized automatically with sample data.
5. You can view the H2 console in your browser at [http://localhost:8080/h2-console](http://localhost:8080/h2-console) (JDBC URL: `jdbc:h2:mem:hosteldb`, Username: `sa`, Password: *empty*).

*Note: To switch from H2 to MySQL, configure your credentials in `backend/.env` (see `backend/.env.example`) and start the server with the `mysql` profile: `mvn spring-boot:run -Dspring-boot.run.profiles=mysql`.*

### 2. Start the Frontend
1. Open a terminal in `frontend/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧑‍💻 Demo Logins

Use these default credentials loaded by the database seeder to explore the roles:

| Role | Email | Password | Assigned Area / Details |
|------|-------|----------|-------------------------|
| **Student** | `aarav@student.edu` | `student123` | Resident of Kaveri, Room K-201 |
| **Student** | `diya@student.edu` | `student123` | Resident of Kaveri, Room K-305 |
| **Warden** | `anita.warden@college.edu` | `warden123` | Warden of Kaveri Block |
| **Warden** | `vikram.warden@college.edu` | `warden123` | Warden of Godavari Block |
| **Admin** | `admin@college.edu` | `admin123` | College Admin / Mess Committee |

---

## 📂 Project Structure

```
Hostel & Mess Management/
├── backend/
│   ├── src/main/java/com/hostel/
│   │   ├── config/             # Security, JWT, static files, and seeder
│   │   ├── controller/         # REST API controller endpoints
│   │   ├── dto/                # Request/Response payloads
│   │   ├── entity/             # JPA entity mappings
│   │   ├── enums/              # Status, Role, and Category enums
│   │   ├── exception/          # Global Advice error handlers
│   │   ├── repository/         # JPA database queries
│   │   └── service/            # Core business services
│   └── src/main/resources/
│       ├── application.yml     # H2 database configurations
│       └── application-mysql.yml # Prod MySQL profile config
├── frontend/
│   ├── src/
│   │   ├── api/                # Axios request client with JWT interceptor
│   │   ├── components/         # Reusable layouts, buttons, cards, forms
│   │   ├── context/            # Auth and Theme React context states
│   │   ├── pages/              # Sign in, Sign up, and dashboards
│   │   ├── App.jsx             # App routers and providers setup
│   │   ├── index.css           # Glassmorphism utilities & CSS variables
│   │   └── main.jsx            # Entry point mounting point
│   ├── vite.config.js          # Dev proxy rules and plugins
│   └── package.json            # Frontend modules list
└── README.md                   # Setup guides and instructions
```
