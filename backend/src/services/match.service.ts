import { MatchModel, GameModel } from '../data-models/match.model';
import { db } from '../index';
import { RunResult } from 'sqlite3';
import { generateUUID } from '../utils/uuid.util';

interface MatchRow {
  MatchId: string;
  ParentMatchId: string | null;
  FormatId: number;
  GroupId: number | null;
  Team1Id: number | null;
  Team2Id: number | null;
  UmpireId: string | null;
  CourtNum: string | null;
  WinnerId: number | null;
  Result: number | null;
  ExtendData: string | null;
  Deleted: number;
  DateCreated: string | null;
  DateModified: string | null;
  DateDeleted: string | null;
}

export class MatchService {
  public async createMatch(match: MatchModel): Promise<MatchModel> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      const sql = `INSERT INTO Match (
        MatchId, ParentMatchId, FormatId, GroupId, Team1Id, Team2Id,
        UmpireId, CourtNum, WinnerId, Result, ExtendData,
        DateCreated, DateModified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      
      db.run(sql, [
        match.matchId || generateUUID(),
        match.parentMatchId,
        match.formatId,
        match.groupId,
        match.team1Id,
        match.team2Id,
        match.umpireId,
        match.courtNum,
        match.winnerId,
        match.result,
        match.extendData,
        now,
        now
      ], function(err) {
        if (err) {
          reject(err);
          return;
        }
        
        resolve({
          ...match,
          dateCreated: now,
          dateModified: now
        });
      });
    });
  }

  public async updateMatch(match: MatchModel): Promise<MatchModel> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      const sql = `UPDATE Match SET 
        ParentMatchId = ?,
        FormatId = ?,
        GroupId = ?,
        Team1Id = ?,
        Team2Id = ?,
        UmpireId = ?,
        CourtNum = ?,
        WinnerId = ?,
        Result = ?,
        ExtendData = ?,
        DateModified = ?
        WHERE MatchId = ?`;
      
      db.run(sql, [
        match.parentMatchId,
        match.formatId,
        match.groupId,
        match.team1Id,
        match.team2Id,
        match.umpireId,
        match.courtNum,
        match.winnerId,
        match.result,
        match.extendData,
        now,
        match.matchId
      ], (err: Error | null) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve({
          ...match,
          dateModified: now
        });
      });
    });
  }

  public async getMatchById(matchId: string): Promise<MatchModel> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM Match WHERE MatchId = ? AND Deleted = FALSE`;
      
      db.get(sql, [matchId], async (err, row: MatchRow) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (!row) {
          reject(new Error('Match not found'));
          return;
        }

        // Get games for this match
        const games = await this.getGamesByMatchId(matchId);
        
        resolve({
          matchId: row.MatchId,
          parentMatchId: row.ParentMatchId || undefined,
          formatId: row.FormatId,
          groupId: row.GroupId || undefined,
          team1Id: row.Team1Id || undefined,
          team2Id: row.Team2Id || undefined,
          umpireId: row.UmpireId || undefined,
          courtNum: row.CourtNum || undefined,
          winnerId: row.WinnerId || undefined,
          result: row.Result || undefined,
          extendData: row.ExtendData || undefined,
          game: games,
          deleted: row.Deleted === 1,
          dateCreated: row.DateCreated || undefined,
          dateModified: row.DateModified || undefined,
          dateDeleted: row.DateDeleted
        });
      });
    });
  }

  public async addGame(game: GameModel): Promise<GameModel> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      const sql = `INSERT INTO Game (MatchId, Team1Score, Team2Score, DateCreated, DateModified) 
                  VALUES (?, ?, ?, ?, ?)`;
      
      db.run(sql, [
        game.matchId,
        game.team1Score,
        game.team2Score,
        now,
        now
      ], function(err) {
        if (err) {
          reject(err);
          return;
        }
        
        resolve({
          ...game,
          gameId: this.lastID,
          dateCreated: now,
          dateModified: now
        });
      });
    });
  }

  public async getGamesByMatchId(matchId: string): Promise<GameModel[]> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM Game WHERE MatchId = ? AND Deleted = FALSE ORDER BY GameId ASC`;
      
      db.all(sql, [matchId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve(rows as GameModel[]);
      });
    });
  }

  public async getMatchesByGroupId(groupId: number): Promise<MatchModel[]> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM Match WHERE GroupId = ? AND Deleted = FALSE ORDER BY DateCreated`;
      
      db.all(sql, [groupId], async (err, rows: MatchRow[]) => {
        if (err) {
          reject(err);
          return;
        }

        // Get games for all matches
        const matchesWithGames = await Promise.all(rows.map(async row => {
          const games = await this.getGamesByMatchId(row.MatchId);
          
          return {
            matchId: row.MatchId,
            parentMatchId: row.ParentMatchId || undefined,
            formatId: row.FormatId,
            groupId: row.GroupId || undefined,
            team1Id: row.Team1Id || undefined,
            team2Id: row.Team2Id || undefined,
            umpireId: row.UmpireId || undefined,
            courtNum: row.CourtNum || undefined,
            winnerId: row.WinnerId || undefined,
            result: row.Result,
            extendData: row.ExtendData || undefined,
            game: games,
            deleted: row.Deleted === 1,
            dateCreated: row.DateCreated || undefined,
            dateModified: row.DateModified || undefined,
            dateDeleted: row.DateDeleted
          };
        }));

        resolve(matchesWithGames);
      });
    });
  }
} 