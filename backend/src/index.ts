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
    
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');

    // Create Tournament table
    db.run(`CREATE TABLE IF NOT EXISTS Tournament (
      TournamentId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      Name VARCHAR(255) NOT NULL,
      Description VARCHAR(1000),
      Deleted BOOLEAN DEFAULT false,
      DateCreated TEXT,
      DateModified TEXT,
      DateDeleted TEXT,
      StartDate TEXT,
      EndDate TEXT,
      InvitationCode BIGINT
    )`);

    // Create Format table
    db.run(`CREATE TABLE IF NOT EXISTS Format (
      FormatId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      TournamentId INTEGER NOT NULL,
      NumOfGroups INT,
      GroupScore INT,
      GroupMaxScore INT,
      GroupBestOf INT,
      GroupWinningCondition INT,
      GroupOffBestOf INT,
      PlayOffScore INT,
      PlayOffMaxScore INT,
      PlayOffBestOf INT,
      PlayOffWinningCondition INT,
      PlayOffFormat INT,
      Deleted BOOLEAN DEFAULT false,
      DateCreated TEXT,
      DateModified TEXT,
      DateDeleted TEXT,
      FormatType INT,
      FOREIGN KEY (TournamentId) REFERENCES Tournament(TournamentId)
    )`);

    // Create Group table
    db.run(`CREATE TABLE IF NOT EXISTS "Group" (
      GroupId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      FormatId INTEGER NOT NULL,
      GroupName VARCHAR(255),
      NumOfTeams INT,
      FOREIGN KEY (FormatId) REFERENCES Format(FormatId)
    )`);

    // Create Team table
    db.run(`CREATE TABLE IF NOT EXISTS Team (
      TeamId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      GroupId INTEGER NOT NULL,
      Player1Name VARCHAR(255) NOT NULL,
      Player2Name VARCHAR(255),
      FOREIGN KEY (GroupId) REFERENCES "Group"(GroupId)
    )`);

    // Create Match table
    db.run(`CREATE TABLE IF NOT EXISTS Match (
      MatchId VARCHAR(36) PRIMARY KEY NOT NULL,
      ParentMatchId VARCHAR(36),
      FormatId INTEGER NOT NULL,
      GroupId INTEGER,
      Team1Id INTEGER,
      Team2Id INTEGER,
      Team1FinalScore INTEGER,
      Team2FinalScore INTEGER,
      UmpireId VARCHAR(36),
      CourtNum VARCHAR(255),
      WinnerId INTEGER,
      Result INTEGER,
      ExtendData VARCHAR(2000),
      FOREIGN KEY (FormatId) REFERENCES Format(FormatId),
      FOREIGN KEY (GroupId) REFERENCES "Group"(GroupId),
      FOREIGN KEY (Team1Id) REFERENCES Team(TeamId),
      FOREIGN KEY (Team2Id) REFERENCES Team(TeamId)
    )`);

    // Update existing date columns to TEXT format
    const updateDateCommands = [
      // Tournament dates
      "UPDATE Tournament SET DateCreated = datetime(DateCreated) WHERE DateCreated IS NOT NULL AND typeof(DateCreated) != 'text'",
      "UPDATE Tournament SET DateModified = datetime(DateModified) WHERE DateModified IS NOT NULL AND typeof(DateModified) != 'text'",
      "UPDATE Tournament SET DateDeleted = datetime(DateDeleted) WHERE DateDeleted IS NOT NULL AND typeof(DateDeleted) != 'text'",
      "UPDATE Tournament SET StartDate = datetime(StartDate) WHERE StartDate IS NOT NULL AND typeof(StartDate) != 'text'",
      "UPDATE Tournament SET EndDate = datetime(EndDate) WHERE EndDate IS NOT NULL AND typeof(EndDate) != 'text'",
      // Format dates
      "UPDATE Format SET DateCreated = datetime(DateCreated) WHERE DateCreated IS NOT NULL AND typeof(DateCreated) != 'text'",
      "UPDATE Format SET DateModified = datetime(DateModified) WHERE DateModified IS NOT NULL AND typeof(DateModified) != 'text'",
      "UPDATE Format SET DateDeleted = datetime(DateDeleted) WHERE DateDeleted IS NOT NULL AND typeof(DateDeleted) != 'text'"
    ];

    updateDateCommands.forEach(command => {
      db.run(command, [], (err) => {
        if (err) {
          console.error(`Error executing ${command}:`, err);
        }
      });
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