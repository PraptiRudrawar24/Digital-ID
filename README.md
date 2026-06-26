# Digital ID Card System for College

A professional, production-ready Digital ID system built with React, Node.js, and PostgreSQL.

## 🚀 Features
- **Realistic UI**: Digital ID card (420px x 240px) with institutional aesthetics.
- **QR Code Verification**: Validates UUIDs and statuses (VALID, REVOKED, EXPIRED).
- **Admin Dashboard**: Manage students, issue IDs, and revoke them.
- **Secure Auth**: JWT-based login with role-based access control.
- **PDF Download**: Save ID cards as high-quality PDFs.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, html2canvas, jsPDF
- **Backend**: Node.js, Express, JWT, bcryptjs
- **Database**: PostgreSQL

## ⚙️ Setup Instructions

### 1. Database
- Create a database named `digital_id_db` in PostgreSQL.
- Execute the SQL commands in `backend/schema.sql`.

### 2. Backend
- Navigate to `/backend`.
- Run `npm install`.
- Rename `.env.example` to `.env` and fill in your database credentials.
- Run `npm run dev`. (Runs on port 5000)

### 3. Frontend
- Navigate to `/frontend`.
- Run `npm install`.
- Run `npm run dev`. (Runs on port 5173)

## 🔑 Default Roles
To make a user an admin, manually update the `role` column in the `users` table:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@edu.com';
```

## 📄 License
MIT License
