<img width="1852" height="905" alt="Screenshot 2026-11-18 180211" src="https://github.com/user-attachments/assets/5bf1cf6c-bc49-4f0f-8604-d851b2fb127a" />
# Complaint Management System

A full-stack web app where users file complaints and track them until they're solved, and admins review, resolve and manage everything from one panel.

Built with **React**, **Node.js / Express** and **MySQL**.

## Features

**For users**
- Register and log in
- File a complaint with a title and description
- See all your complaints with a Pending / Solved status
- Dashboard with totals at a glance

**For admins**
- Overview with complaint counts, registered users and resolution rate
- View all complaints, search them and filter by status
- Mark complaints as solved, reopen them, or delete them
- View all users and deactivate or reactivate accounts (inactive users can't log in)

**General**
- Role-based access: users can't open admin pages and admins can't open user pages
- Responsive layout that works on phones and laptops

## Screenshots

<img width="1880" height="937" alt="Screenshot 2026-11-18 180248" src="https://github.com/user-attachments/assets/8e4482b5-256f-44f7-a60d-e38cbeb2cb7f" />
<img width="1872" height="962" alt="Screenshot 2026-11-18 180225" src="https://github.com/user-attachments/assets/17971df2-5eb6-4aef-991c-adfd066eddb0" />
<img width="1852" height="905" alt="Screenshot 2026-11-18 180211" src="https://github.com/user-attachments/assets/5bf1cf6c-bc49-4f0f-8604-d851b2fb127a" />


## Tech stack

| Layer      | Technology                         |
| ---------- | ---------------------------------- |
| Frontend   | React, React Router, CSS           |
| Backend    | Node.js, Express                   |
| Database   | MySQL (`mysql2`)                   |

## Getting started

### Prerequisites
- Node.js 18 or later
- MySQL or MariaDB running locally (for example through XAMPP)

### 1. Set up the database
1. Create a database named `complaint_system`.
2. Import `database/complaint_system.sql` into it (phpMyAdmin → Import, or the `mysql` command line).

### 2. Start the backend
```bash
cd backend
npm install
npm start
```
You should see `Database connected` followed by `Server running on http://localhost:5000`.

If your MySQL user or password isn't the default (`root` with no password), change them in the `createPool` block in `backend/server.js`.

### 3. Start the frontend
In a second terminal, from the project root:
```bash
npm install
npm start
```
The app opens at http://localhost:3000.

## Demo logins

| Role  | Username | Password   |
| ----- | -------- | ---------- |
| Admin | `admin`  | `admin123` |
| User  | `user1`  | `user123`  |

## Project structure

```
complaint-system/
├── backend/
│   └── server.js            Express API and MySQL connection
├── database/
│   └── complaint_system.sql Database schema and sample data
├── screenshots/             Images used in this README
└── src/
    ├── api/api.js           API calls and session helpers
    ├── components/          Layout, Sidebar, StatusBadge
    ├── pages/               Login, Register, dashboards, complaints, users
    ├── App.js               Routes and role-based route guard
    └── App.css              All styling
```

## API endpoints

| Method | Endpoint                      | Purpose                           |
| ------ | ----------------------------- | --------------------------------- |
| POST   | `/api/login`                  | Log in                            |
| POST   | `/api/register`               | Create an account                 |
| GET    | `/api/complaints`             | List complaints (`?user_id=` to filter) |
| POST   | `/api/complaints`             | File a complaint                  |
| PUT    | `/api/complaints/:id/status`  | Mark Pending or Solved            |
| DELETE | `/api/complaints/:id`         | Delete a complaint                |
| GET    | `/api/users`                  | List users                        |
| PUT    | `/api/users/:id/status`       | Activate or deactivate a user     |

## Known limitations and next steps

- Passwords are stored as plain text. Next step: hash them with `bcrypt`.
- Admin routes aren't protected on the server yet. Next step: JWT login tokens checked on each request.
- Runs locally only; it hasn't been deployed.
