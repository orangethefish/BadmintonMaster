import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import { join } from 'path';
import { TournamentController } from './controllers/tournament.controller';
import { AuthController } from './controllers/auth.controller';
import { verifyToken } from './middleware/auth.middleware';

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

    // Create User table
    db.run(`CREATE TABLE IF NOT EXISTS User (
      UserId VARCHAR(36) PRIMARY KEY NOT NULL,
      Username VARCHAR(255) NOT NULL UNIQUE,
      Password VARCHAR(255) NOT NULL,
      Email VARCHAR(255) NOT NULL UNIQUE,
      FirstName VARCHAR(255) NOT NULL,
      LastName VARCHAR(255) NOT NULL,
      Deleted BOOLEAN DEFAULT false,
      DateCreated DATETIME,
      DateModified DATETIME,
      DateDeleted DATETIME
    )`);

    // Create Tournament table
    db.run(`CREATE TABLE IF NOT EXISTS Tournament (
      TournamentId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      OwnerId VARCHAR(36) NOT NULL,
      Name VARCHAR(255) NOT NULL,
      Description VARCHAR(1000),
      Deleted BOOLEAN DEFAULT false,
      DateCreated DATETIME,
      DateModified DATETIME,
      DateDeleted DATETIME,
      StartDate DATETIME,
      EndDate DATETIME,
      InvitationCode BIGINT,
      FOREIGN KEY (OwnerId) REFERENCES User(UserId)
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
      DateCreated DATETIME,
      DateModified DATETIME,
      DateDeleted DATETIME,
      FormatType INT,
      FOREIGN KEY (TournamentId) REFERENCES Tournament(TournamentId)
    )`);

    // Create Group table
    db.run(`CREATE TABLE IF NOT EXISTS "Group" (
      GroupId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      FormatId INTEGER NOT NULL,
      GroupName VARCHAR(255),
      NumOfTeams INT,
      Deleted BOOLEAN DEFAULT false,
      DateCreated DATETIME,
      DateModified DATETIME,
      DateDeleted DATETIME,
      FOREIGN KEY (FormatId) REFERENCES Format(FormatId)
    )`);

    // Create Team table
    db.run(`CREATE TABLE IF NOT EXISTS Team (
      TeamId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      GroupId INTEGER NOT NULL,
      Player1Name VARCHAR(255) NOT NULL,
      Player2Name VARCHAR(255),
      Deleted BOOLEAN DEFAULT false,
      DateCreated DATETIME,
      DateModified DATETIME,
      DateDeleted DATETIME,
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
      Deleted BOOLEAN DEFAULT false,
      DateCreated DATETIME,
      DateModified DATETIME,
      DateDeleted DATETIME,
      FOREIGN KEY (FormatId) REFERENCES Format(FormatId),
      FOREIGN KEY (GroupId) REFERENCES "Group"(GroupId),
      FOREIGN KEY (Team1Id) REFERENCES Team(TeamId),
      FOREIGN KEY (Team2Id) REFERENCES Team(TeamId)
    )`);

    // Update existing date columns to DATETIME format
    // const updateDateCommands = [
    //   // Tournament dates
    //   "UPDATE Tournament SET DateCreated = datetime(DateCreated) WHERE DateCreated IS NOT NULL",
    //   "UPDATE Tournament SET DateModified = datetime(DateModified) WHERE DateModified IS NOT NULL",
    //   "UPDATE Tournament SET DateDeleted = datetime(DateDeleted) WHERE DateDeleted IS NOT NULL",
    //   "UPDATE Tournament SET StartDate = datetime(StartDate) WHERE StartDate IS NOT NULL",
    //   "UPDATE Tournament SET EndDate = datetime(EndDate) WHERE EndDate IS NOT NULL",
    //   // Format dates
    //   "UPDATE Format SET DateCreated = datetime(DateCreated) WHERE DateCreated IS NOT NULL",
    //   "UPDATE Format SET DateModified = datetime(DateModified) WHERE DateModified IS NOT NULL",
    //   "UPDATE Format SET DateDeleted = datetime(DateDeleted) WHERE DateDeleted IS NOT NULL",
    //   // Group dates
    //   "UPDATE \"Group\" SET DateCreated = datetime(DateCreated) WHERE DateCreated IS NOT NULL",
    //   "UPDATE \"Group\" SET DateModified = datetime(DateModified) WHERE DateModified IS NOT NULL",
    //   "UPDATE \"Group\" SET DateDeleted = datetime(DateDeleted) WHERE DateDeleted IS NOT NULL",
    //   // Team dates
    //   "UPDATE Team SET DateCreated = datetime(DateCreated) WHERE DateCreated IS NOT NULL",
    //   "UPDATE Team SET DateModified = datetime(DateModified) WHERE DateModified IS NOT NULL",
    //   "UPDATE Team SET DateDeleted = datetime(DateDeleted) WHERE DateDeleted IS NOT NULL",
    //   // Match dates
    //   "UPDATE Match SET DateCreated = datetime(DateCreated) WHERE DateCreated IS NOT NULL",
    //   "UPDATE Match SET DateModified = datetime(DateModified) WHERE DateModified IS NOT NULL",
    //   "UPDATE Match SET DateDeleted = datetime(DateDeleted) WHERE DateDeleted IS NOT NULL"
    // ];

    // updateDateCommands.forEach(command => {
    //   db.run(command, [], (err) => {
    //     if (err) {
    //       console.error(`Error executing ${command}:`, err);
    //     }
    //   });
    // });
  }
});

// Initialize controllers
const tournamentController = new TournamentController();
const authController = new AuthController();

// Routes
app.use('/api/tournaments', tournamentController.router);
app.use('/api/auth', authController.router);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 