import { FormatModel } from '../data-models/format.model';
import { db } from '../index';
import { RunResult } from 'sqlite3';

export class FormatService {
  public async addFormat(format: FormatModel): Promise<FormatModel> {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO Format (
        TournamentId, NumOfGroups, GroupScore, GroupMaxScore,
        GroupBestOf, GroupWinningCondition, GroupOffBestOf,
        PlayOffScore, PlayOffMaxScore, PlayOffBestOf,
        PlayOffWinningCondition, PlayOffFormat, Deleted,
        DateCreated, DateModified, DateDeleted,
        FormatType
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const params = [
        format.tournamentId,
        format.numOfGroups,
        format.groupScore,
        format.groupMaxScore,
        format.groupBestOf,
        format.groupWinningCondition,
        format.groupOffBestOf,
        format.playOffScore,
        format.playOffMaxScore,
        format.playOffBestOf,
        format.playOffWinningCondition,
        format.playOffFormat,
        false, // Deleted
        format.dateCreated,
        format.dateModified,
        format.dateDeleted,
        format.formatType
      ];

      const self = this;
      db.run(sql, params, async function(this: RunResult, err: Error | null) {
        if (err) {
          console.error('Error adding format:', err);
          reject(err);
          return;
        }
        try {
          const createdFormat = await self.getFormatById(this.lastID);
          resolve(createdFormat);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  public async getFormatById(id: number): Promise<FormatModel> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          FormatId as formatId,
          TournamentId as tournamentId,
          NumOfGroups as numOfGroups,
          GroupScore as groupScore,
          GroupMaxScore as groupMaxScore,
          GroupBestOf as groupBestOf,
          GroupWinningCondition as groupWinningCondition,
          GroupOffBestOf as groupOffBestOf,
          PlayOffScore as playOffScore,
          PlayOffMaxScore as playOffMaxScore,
          PlayOffBestOf as playOffBestOf,
          PlayOffWinningCondition as playOffWinningCondition,
          PlayOffFormat as playOffFormat,
          Deleted as deleted,
          DateCreated as dateCreated,
          DateModified as dateModified,
          DateDeleted as dateDeleted,
          FormatType as formatType
        FROM Format 
        WHERE FormatId = ?`;
      
      db.get(sql, [id], (err: Error | null, row: any) => {
        if (err) {
          reject(err);
          return;
        }
        if (!row) {
          reject(new Error('Format not found'));
          return;
        }
        resolve(row);
      });
    });
  }

  public async getFormatsByTournamentId(tournamentId: number): Promise<FormatModel[]> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          FormatId as formatId,
          TournamentId as tournamentId,
          NumOfGroups as numOfGroups,
          GroupScore as groupScore,
          GroupMaxScore as groupMaxScore,
          GroupBestOf as groupBestOf,
          GroupWinningCondition as groupWinningCondition,
          GroupOffBestOf as groupOffBestOf,
          PlayOffScore as playOffScore,
          PlayOffMaxScore as playOffMaxScore,
          PlayOffBestOf as playOffBestOf,
          PlayOffWinningCondition as playOffWinningCondition,
          PlayOffFormat as playOffFormat,
          Deleted as deleted,
          DateCreated as dateCreated,
          DateModified as dateModified,
          DateDeleted as dateDeleted,
          FormatType as formatType
        FROM Format 
        WHERE TournamentId = ? AND Deleted = false`;
      
      db.all(sql, [tournamentId], (err: Error | null, rows: any[]) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }
} 