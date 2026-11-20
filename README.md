# EduConnect Frontend

EduConnect is a full-stack education platform connecting students, teachers, administrators, courses, study resources, admissions, and a digital library.

This repository contains the React frontend. The backend is maintained separately in [EduConnect-Backend](https://github.com/akashsingh7325/EduConnect-Backend).

## Features

- Student, teacher, and administrator experiences
- JWT-based authentication and refresh-token handling
- Role-protected routes
- Teacher discovery and admission workflows
- Courses, lessons, practice problems, and study materials
- Library catalogue, book access, and reading progress
- Responsive administrative dashboard with audit-related views
- Centralized API requests and session-expiry handling

## Technology Stack

- React 19
- Vite
- React Router
- Tailwind CSS
- Lucide React
- Oxlint

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Create `.env.local` from `.env.example` and configure the API URL locally. Never commit environment files, tokens, or credentials.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Backend Integration

The frontend uses a centralized API client and derives active authorization through backend authentication. See [EduConnect-Backend](https://github.com/akashsingh7325/EduConnect-Backend) for setup and API documentation.

## Security Notes

- Never commit environment files or API secrets.
- JWT storage and logout behavior are handled centrally.
- Backend authorization is the security source of truth; frontend route protection is only navigation control.
