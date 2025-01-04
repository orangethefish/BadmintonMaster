import { MatchModel } from '../data-models/match.model';
import { db } from '../index';
import { RunResult } from 'sqlite3';
import { generateUUID } from '../utils/uuid.util';

export class MatchService {
  public async addMatch(match: MatchModel): Promise<MatchModel> {
    return new Promise((resolve, reject) => {
      // Generate UUID for new match
      const matchId = generateUUID();

      const sql = `INSERT INTO Match (
        MatchId, ParentMatchId, FormatId, GroupId,
        Team1Id, Team2Id, Team1FinalScore, Team2FinalScore,
        UmpireId, CourtNum, WinnerId, Result, ExtendData
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const params = [
        matchId,
        match.parentMatchId,
        match.formatId,
        match.groupId,
        match.team1Id,
        match.team2Id,
        match.team1FinalScore,
        match.team2FinalScore,
        match.umpireId,
        match.courtNum,
        match.winnerId,
        match.result,
        match.extendData
      ];

      const self = this;
      db.run(sql, params, async function(this: RunResult, err: Error | null) {
        if (err) {
          console.error('Error adding match:', err);
          reject(err);
          return;
        }
        try {
          const createdMatch = await self.getMatchById(matchId);
          resolve(createdMatch);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  public async getMatchById(id: string): Promise<MatchModel> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          MatchId as matchId,
          ParentMatchId as parentMatchId,
          FormatId as formatId,
          GroupId as groupId,
          Team1Id as team1Id,
          Team2Id as team2Id,
          Team1FinalScore as team1FinalScore,
          Team2FinalScore as team2FinalScore,
          UmpireId as umpireId,
          CourtNum as courtNum,
          WinnerId as winnerId,
          Result as result,
          ExtendData as extendData
        FROM Match 
        WHERE MatchId = ?`;
      
      db.get(sql, [id], (err: Error | null, row: any) => {
        if (err) {
          reject(err);
          return;
        }
        if (!row) {
          reject(new Error('Match not found'));
          return;
        }
        resolve(row);
      });
    });
  }

  public async getMatchesByGroupId(groupId: number): Promise<MatchModel[]> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          MatchId as matchId,
          ParentMatchId as parentMatchId,
          FormatId as formatId,
          GroupId as groupId,
          Team1Id as team1Id,
          Team2Id as team2Id,
          Team1FinalScore as team1FinalScore,
          Team2FinalScore as team2FinalScore,
          UmpireId as umpireId,
          CourtNum as courtNum,
          WinnerId as winnerId,
          Result as result,
          ExtendData as extendData,
          Deleted as deleted,
          DateCreated as dateCreated,
          DateModified as dateModified,
          DateDeleted as dateDeleted
        FROM Match 
        WHERE GroupId = ? AND (Deleted = false OR Deleted IS NULL)
        ORDER BY DateCreated`;
      
      db.all(sql, [groupId], (err: Error | null, rows: any[]) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

  public async getMatchesByFormatId(formatId: number): Promise<MatchModel[]> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          MatchId as matchId,
          ParentMatchId as parentMatchId,
          FormatId as formatId,
          GroupId as groupId,
          Team1Id as team1Id,
          Team2Id as team2Id,
          Team1FinalScore as team1FinalScore,
          Team2FinalScore as team2FinalScore,
          UmpireId as umpireId,
          CourtNum as courtNum,
          WinnerId as winnerId,
          Result as result,
          ExtendData as extendData,
          Deleted as deleted,
          DateCreated as dateCreated,
          DateModified as dateModified,
          DateDeleted as dateDeleted
        FROM Match 
        WHERE FormatId = ? AND (Deleted = false OR Deleted IS NULL)`;
      
      db.all(sql, [formatId], (err: Error | null, rows: any[]) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

  public async getChildMatches(parentMatchId: string): Promise<MatchModel[]> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          MatchId as matchId,
          ParentMatchId as parentMatchId,
          FormatId as formatId,
          GroupId as groupId,
          Team1Id as team1Id,
          Team2Id as team2Id,
          Team1FinalScore as team1FinalScore,
          Team2FinalScore as team2FinalScore,
          UmpireId as umpireId,
          CourtNum as courtNum,
          WinnerId as winnerId,
          Result as result,
          ExtendData as extendData
        FROM Match 
        WHERE ParentMatchId = ?`;
      
      db.all(sql, [parentMatchId], (err: Error | null, rows: any[]) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

  public async updateMatch(match: MatchModel): Promise<MatchModel> {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE Match SET
        ParentMatchId = ?,
        FormatId = ?,
        GroupId = ?,
        Team1Id = ?,
        Team2Id = ?,
        Team1FinalScore = ?,
        Team2FinalScore = ?,
        UmpireId = ?,
        CourtNum = ?,
        WinnerId = ?,
        Result = ?,
        ExtendData = ?,
        DateModified = ?
        WHERE MatchId = ?`;

      const now = new Date().toISOString();
      const params = [
        match.parentMatchId,
        match.formatId,
        match.groupId,
        match.team1Id,
        match.team2Id,
        match.team1FinalScore,
        match.team2FinalScore,
        match.umpireId,
        match.courtNum,
        match.winnerId,
        match.result,
        match.extendData,
        now,
        match.matchId
      ];

      const self = this;
      db.run(sql, params, async function(this: RunResult, err: Error | null) {
        if (err) {
          console.error('Error updating match:', err);
          reject(err);
          return;
        }
        if (this.changes === 0) {
          reject(new Error('Match not found'));
          return;
        }
        try {
          const updatedMatch = await self.getMatchById(match.matchId!);
          resolve(updatedMatch);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
} 