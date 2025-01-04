import { FormatModel } from '../data-models/format.model';
import { db } from '../index';
import { RunResult } from 'sqlite3';

export class FormatService {
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

  public async addOrUpdateFormat(format: FormatModel): Promise<FormatModel> {
    // Check if format exists if ID is provided
    if (format.formatId) {
      try {
        await this.getFormatById(format.formatId);
        return this.updateFormat(format);
      } catch (error) {
        // If format not found, proceed with creation
        if ((error as Error).message === 'Format not found') {
          return this.createFormat(format);
        }
        throw error;
      }
    }
    return this.createFormat(format);
  }

  private async createFormat(format: FormatModel): Promise<FormatModel> {
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

  private async updateFormat(format: FormatModel): Promise<FormatModel> {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE Format SET
        TournamentId = ?,
        NumOfGroups = ?,
        GroupScore = ?,
        GroupMaxScore = ?,
        GroupBestOf = ?,
        GroupWinningCondition = ?,
        GroupOffBestOf = ?,
        PlayOffScore = ?,
        PlayOffMaxScore = ?,
        PlayOffBestOf = ?,
        PlayOffWinningCondition = ?,
        PlayOffFormat = ?,
        DateModified = ?,
        FormatType = ?
        WHERE FormatId = ?`;

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
        format.dateModified,
        format.formatType,
        format.formatId
      ];

      const self = this;
      db.run(sql, params, async function(this: RunResult, err: Error | null) {
        if (err) {
          console.error('Error updating format:', err);
          reject(err);
          return;
        }
        if (this.changes === 0) {
          reject(new Error('Format not found'));
          return;
        }
        try {
          const updatedFormat = await self.getFormatById(format.formatId!);
          resolve(updatedFormat);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
} 