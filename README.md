# Rural Healthcare Record Management System

Full-stack web application for managing patient records in rural primary health centres.

**Stack**: React + Node.js (Express) + MySQL

---

## Project Structure

```
rural-healthcare/
├── backend/
│   ├── config/
│   │   ├── db.js          # MySQL connection pool
│   │   └── schema.sql     # DB schema + sample data
│   ├── routes/
│   │   ├── patients.js    # CRUD for patients
│   │   ├── visits.js      # Visit log per patient
│   │   ├── history.js     # Medical history records
│   │   └── stats.js       # Dashboard stats
│   ├── server.js          # Express entry point
│   ├── .env.example       # Env template
│   └── package.json
└── frontend/
    ├── public/index.html
    ├── src/
    │   ├── components/Sidebar.js
    │   ├── pages/
    │   │   ├── Dashboard.js
    │   │   ├── PatientList.js
    │   │   ├── PatientForm.js
    │   │   └── PatientDetail.js
    │   ├── services/api.js
    │   ├── App.js
    │   └── index.css
    └── package.json
```

---

## Setup Instructions

### 1. MySQL — Create Database

Open MySQL and run:

```sql
SOURCE backend/config/schema.sql;
```

Or import via MySQL Workbench.

---

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env — set your MySQL password
npm install
npm run dev        # Runs on http://localhost:5000
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start          # Runs on http://localhost:3000
```

The frontend proxies `/api/*` to `localhost:5000` automatically.

---

## Features

| Feature | Description |
|---|---|
| Dashboard | Total patients, visits today, this month, recent visits list, gender chart |
| Patient List | Search by name / village / phone, view all records with age and blood type |
| Add Patient | Full registration form — personal info, address, emergency contact |
| Edit Patient | Update any patient record |
| Patient Detail | Complete profile with tabs for visits and medical history |
| Visit Log | Add visit with date, reason, diagnosis, prescription, follow-up |
| Medical History | Record conditions, allergies, and current medications |
| Delete | Remove patients (cascades to visits and history) |

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | /api/patients | All patients (optional ?search=) |
| POST | /api/patients | Create patient |
| GET | /api/patients/:id | Single patient |
| PUT | /api/patients/:id | Update patient |
| DELETE | /api/patients/:id | Delete patient |
| GET | /api/visits/:patientId | Visits for patient |
| POST | /api/visits | Add visit |
| DELETE | /api/visits/:id | Delete visit |
| GET | /api/history/:patientId | Medical history |
| POST | /api/history | Add history record |
| DELETE | /api/history/:id | Delete record |
| GET | /api/stats | Dashboard statistics |
