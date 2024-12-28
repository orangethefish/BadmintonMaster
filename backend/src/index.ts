import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import { join } from 'path';
import { handleDates } from './middleware/dateHandler.middleware';
import { TournamentController } from './controllers/tournament.controller';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = join(__dirname, '../../db/database.sqlite');
export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to SQLite database');
    
    // Check if table exists and get current schema
    db.get("SELECT sql FROM sqlite_master WHERE type='table' AND name='Tournament'", [], (err, result) => {
      if (err) {
        console.error('Error checking table schema:', err);
        return;
      }

      if (!result) {
        // Create table if it doesn't exist
        db.run(`CREATE TABLE Tournament (
          TournamentId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          Name VARCHAR(100) NOT NULL,
          Description VARCHAR(1000), 
          NumOfGroups INT,
          GroupScore INT,
          GroupMaxScore INT,
          GroupBestOf INT,
          GroupWinning INT,
          GroupOffBestOf INT,
          PlayOffScore INT,
          PlayOffMaxScore INT,
          PlayOffBestOf INT,
          PlayOffWinning INT,
          PlayOffFormat INT,
          Deleted BOOLEAN,
          DateCreated TEXT,
          DateModified TEXT,
          DateDeleted TEXT,
          StartDate TEXT,
          EndDate TEXT,
          InvitationCode INT
        )`);
      } else {
        // Check and add missing columns
        const alterCommands = [
          "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS Name VARCHAR(100)",
          "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS Description VARCHAR(1000)",
          "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS NumOfGroups INT",
          "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS GroupScore INT",
          "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS GroupMaxScore INT",
          "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS GroupBestOf INT",
          "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS GroupWinning INT",
          "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS GroupOffBestOf INT",
          "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS PlayOffScore INT",
          "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS PlayOffMaxScore INT",
          "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS PlayOffBestOf INT",
          "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS PlayOffWinning INT",
          "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS PlayOffFormat INT",
          "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS Deleted BOOLEAN DEFAULT false",
          "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS DateCreated TEXT",
          "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS DateModified TEXT",
          "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS DateDeleted TEXT",
          "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS StartDate TEXT",
          "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS EndDate TEXT",
          "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS InvitationCode INT"
        ];

        // Execute each ALTER TABLE command
        alterCommands.forEach(command => {
          db.run(command, [], (err) => {
            if (err && !err.message.includes('duplicate column name')) {
              console.error(`Error executing ${command}:`, err);
            }
          });
        });

        // Update existing DATETIME columns to TEXT if they exist
        const updateCommands = [
          "UPDATE Tournament SET DateCreated = datetime(DateCreated) WHERE DateCreated IS NOT NULL AND typeof(DateCreated) != 'text'",
          "UPDATE Tournament SET DateModified = datetime(DateModified) WHERE DateModified IS NOT NULL AND typeof(DateModified) != 'text'",
          "UPDATE Tournament SET DateDeleted = datetime(DateDeleted) WHERE DateDeleted IS NOT NULL AND typeof(DateDeleted) != 'text'",
          "UPDATE Tournament SET StartDate = datetime(StartDate) WHERE StartDate IS NOT NULL AND typeof(StartDate) != 'text'",
          "UPDATE Tournament SET EndDate = datetime(EndDate) WHERE EndDate IS NOT NULL AND typeof(EndDate) != 'text'"
        ];

        // Execute each UPDATE command
        updateCommands.forEach(command => {
          db.run(command, [], (err) => {
            if (err) {
              console.error(`Error executing ${command}:`, err);
            }
          });
        });
      }
    });
  }
});

// Initialize controllers
const tournamentController = new TournamentController();

// Tournament routes
app.post('/api/tournaments', handleDates, tournamentController.add.bind(tournamentController));

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