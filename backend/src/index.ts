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
export const db = new sqlite3.Database(dbPath, async (err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to SQLite database');
    
    try {
      // Enable foreign keys
      await runQuery('PRAGMA foreign_keys = ON');

      // Create or update tables
      await setupDatabase();
    } catch (error) {
      console.error('Error setting up database:', error);
    }
  }
});

// Helper function to run queries as promises
function runQuery(sql: string, params: any[] = []): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function setupDatabase() {
  // Create Tournament table if it doesn't exist
  const tournamentTable = await new Promise<any>((resolve, reject) => {
    db.get("SELECT sql FROM sqlite_master WHERE type='table' AND name='Tournament'", [], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

  if (!tournamentTable) {
    await runQuery(`CREATE TABLE Tournament (
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
  } else {
    // Update existing Tournament table
    const alterTournamentCommands = [
      "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS Name VARCHAR(255)",
      "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS Description VARCHAR(1000)",
      "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS Deleted BOOLEAN DEFAULT false",
      "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS DateCreated TEXT",
      "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS DateModified TEXT",
      "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS DateDeleted TEXT",
      "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS StartDate TEXT",
      "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS EndDate TEXT",
      "ALTER TABLE Tournament ADD COLUMN IF NOT EXISTS InvitationCode BIGINT"
    ];

    for (const command of alterTournamentCommands) {
      try {
        await runQuery(command);
      } catch (err: any) {
        if (!err.message.includes('duplicate column name')) {
          console.error(`Error executing ${command}:`, err);
        }
      }
    }
  }

  // Create Format table if it doesn't exist
  const formatTable = await new Promise<any>((resolve, reject) => {
    db.get("SELECT sql FROM sqlite_master WHERE type='table' AND name='Format'", [], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

  if (!formatTable) {
    await runQuery(`CREATE TABLE Format (
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
  } else {
    // Update existing Format table
    const alterFormatCommands = [
      "ALTER TABLE Format ADD COLUMN IF NOT EXISTS TournamentId INTEGER",
      "ALTER TABLE Format ADD COLUMN IF NOT EXISTS NumOfGroups INT",
      "ALTER TABLE Format ADD COLUMN IF NOT EXISTS GroupScore INT",
      "ALTER TABLE Format ADD COLUMN IF NOT EXISTS GroupMaxScore INT",
      "ALTER TABLE Format ADD COLUMN IF NOT EXISTS GroupBestOf INT",
      "ALTER TABLE Format ADD COLUMN IF NOT EXISTS GroupWinningCondition INT",
      "ALTER TABLE Format ADD COLUMN IF NOT EXISTS GroupOffBestOf INT",
      "ALTER TABLE Format ADD COLUMN IF NOT EXISTS PlayOffScore INT",
      "ALTER TABLE Format ADD COLUMN IF NOT EXISTS PlayOffMaxScore INT",
      "ALTER TABLE Format ADD COLUMN IF NOT EXISTS PlayOffBestOf INT",
      "ALTER TABLE Format ADD COLUMN IF NOT EXISTS PlayOffWinningCondition INT",
      "ALTER TABLE Format ADD COLUMN IF NOT EXISTS PlayOffFormat INT",
      "ALTER TABLE Format ADD COLUMN IF NOT EXISTS Deleted BOOLEAN DEFAULT false",
      "ALTER TABLE Format ADD COLUMN IF NOT EXISTS DateCreated TEXT",
      "ALTER TABLE Format ADD COLUMN IF NOT EXISTS DateModified TEXT",
      "ALTER TABLE Format ADD COLUMN IF NOT EXISTS DateDeleted TEXT",
      "ALTER TABLE Format ADD COLUMN IF NOT EXISTS FormatType INT"
    ];

    for (const command of alterFormatCommands) {
      try {
        await runQuery(command);
      } catch (err: any) {
        if (!err.message.includes('duplicate column name')) {
          console.error(`Error executing ${command}:`, err);
        }
      }
    }
  }

  // After tables are created, update date formats
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

  for (const command of updateDateCommands) {
    try {
      await runQuery(command);
    } catch (err) {
      console.error(`Error executing ${command}:`, err);
    }
  }
}

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