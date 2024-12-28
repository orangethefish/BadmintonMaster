import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import { join } from 'path';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = join(__dirname, '../../db/database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to SQLite database');
    // Create tables if they don't exist
    db.run(`CREATE TABLE IF NOT EXISTS Tournament (
    TournamentId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    Discription VARCHAR(100), 
    NumOfGroups INT,
    GroupScore INT,
    GroupMaxScore INT,
    GroupBestOf INT, -- Originally enum
    GroupWinning INT, -- Originally enum
    GroupOffBestOf INT,
    PlayOffScore INT,
    PlayOffMaxScore INT,
    PlayOffBestOf INT, -- Originally enum
    PlayOffWinning INT, -- Originally enum
    PlayOffFormat INT, -- Originally enum
    Deleted BOOLEAN,
    DateCreated DATETIME,
    DateModified DATETIME,
    DateDeleted DATETIME NULLABLE,
    StartDate DATETIME,
    EndDate DATETIME,
    InvitationCode INT
    );`);
  }
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Example route with database query
app.get('/api/examples', (req, res) => {
  db.all('SELECT * FROM examples', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 