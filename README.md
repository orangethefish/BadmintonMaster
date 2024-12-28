# Full Stack Application

A full-stack application using Next.js, Express.js, and SQLite.

## Project Structure

- `frontend/` - Next.js frontend application
- `backend/` - Express.js backend API
- `db/` - SQLite database files

## Setup Instructions

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:3000

### Backend (Express.js)

```bash
cd backend
npm install
npm run dev
```

The backend API will run on http://localhost:3001

## Database

The SQLite database file will be automatically created in the `db` folder when the backend starts.

## Available Scripts

### Frontend

- `npm run dev` - Run development server
- `npm run build` - Build for production
- `npm start` - Start production server

### Backend

- `npm run dev` - Run development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run watch` - Watch for TypeScript changes 