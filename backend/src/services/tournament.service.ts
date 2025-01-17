import { TournamentModel } from '../data-models/tournament.model';
import { FormatModel } from '../data-models/format.model';
import { db } from '../index';
import { RunResult } from 'sqlite3';
import { FormatService } from './format.service';

export interface TournamentWithFormats extends TournamentModel {
  formats?: FormatModel[];
}

export class TournamentService {
  private formatService: FormatService;

  constructor() {
    this.formatService = new FormatService();
  }

  private async isInvitationCodeActive(code: number, excludeTournamentId?: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT COUNT(*) as count 
        FROM Tournament 
        WHERE InvitationCode = ? 
        AND Deleted = false 
        AND datetime(EndDate) > datetime('now')
        ${excludeTournamentId ? 'AND TournamentId != ?' : ''}`;
      
      const params = excludeTournamentId 
        ? [code, excludeTournamentId]
        : [code];

      db.get(sql, params, (err: Error | null, result: { count: number }) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result.count > 0);
      });
    });
  }

  private async generateUniqueInvitationCode(): Promise<number> {
    const min = 100000; // 6-digit number
    const max = 999999;
    
    while (true) {
      const code = Math.floor(Math.random() * (max - min + 1)) + min;
      const isActive = await this.isInvitationCodeActive(code);
      
      if (!isActive) {
        return code;
      }
    }
  }

  public async getTournamentById(id: number): Promise<TournamentModel> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          TournamentId as tournamentId,
          Name as name,
          Description as description,
          Deleted as deleted,
          DateCreated as dateCreated,
          DateModified as dateModified,
          DateDeleted as dateDeleted,
          StartDate as startDate,
          EndDate as endDate,
          InvitationCode as invitationCode
        FROM Tournament 
        WHERE TournamentId = ?`;
      
      db.get(sql, [id], (err: Error | null, row: any) => {
        if (err) {
          reject(err);
          return;
        }
        if (!row) {
          reject(new Error('Tournament not found'));
          return;
        }
        resolve(row);
      });
    });
  }

  public async getTournamentWithFormats(id: number): Promise<TournamentWithFormats> {
    const tournament = await this.getTournamentById(id);
    const formats = await this.formatService.getFormatsByTournamentId(id);
    return { ...tournament, formats };
  }

  public async addOrUpdateTournament(tournament: TournamentModel): Promise<TournamentModel> {
    // Check if tournament exists if ID is provided
    if (tournament.tournamentId) {
      try {
        const existingTournament = await this.getTournamentById(tournament.tournamentId);
        // Verify ownership
        if (existingTournament.ownerId !== tournament.ownerId) {
          throw new Error('Access denied. You are not the owner of this tournament.');
        }
        return this.updateTournament(tournament);
      } catch (error) {
        // If tournament not found, proceed with creation
        if (error.message === 'Tournament not found') {
          return this.createTournament(tournament);
        }
        throw error;
      }
    }
    return this.createTournament(tournament);
  }

  private async createTournament(tournament: TournamentModel): Promise<TournamentModel> {
    // Generate invitation code if not provided
    if (!tournament.invitationCode) {
      tournament.invitationCode = await this.generateUniqueInvitationCode();
    } else {
      // Verify provided code is not in use
      const isActive = await this.isInvitationCodeActive(tournament.invitationCode);
      if (isActive) {
        throw new Error('Invitation code is already in use by an active tournament');
      }
    }

    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO Tournament (
        OwnerId, Name, Description, Deleted,
        DateCreated, DateModified, DateDeleted,
        StartDate, EndDate, InvitationCode
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const params = [
        tournament.ownerId,
        tournament.name,
        tournament.description,
        false, // Deleted
        tournament.dateCreated,
        tournament.dateModified,
        tournament.dateDeleted,
        tournament.startDate,
        tournament.endDate,
        tournament.invitationCode
      ];

      const self = this;
      db.run(sql, params, async function(this: RunResult, err: Error | null) {
        if (err) {
          console.error('Error adding tournament:', err);
          reject(err);
          return;
        }
        try {
          const createdTournament = await self.getTournamentById(this.lastID);
          resolve(createdTournament);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  private async updateTournament(tournament: TournamentModel): Promise<TournamentModel> {
    // Verify invitation code if changed
    if (tournament.invitationCode) {
      const isActive = await this.isInvitationCodeActive(tournament.invitationCode, tournament.tournamentId);
      if (isActive) {
        throw new Error('Invitation code is already in use by an active tournament');
      }
    }

    return new Promise((resolve, reject) => {
      const sql = `UPDATE Tournament SET
        Name = ?,
        Description = ?,
        DateModified = ?,
        StartDate = ?,
        EndDate = ?,
        InvitationCode = ?
        WHERE TournamentId = ? AND OwnerId = ?`;

      const params = [
        tournament.name,
        tournament.description,
        tournament.dateModified,
        tournament.startDate,
        tournament.endDate,
        tournament.invitationCode,
        tournament.tournamentId,
        tournament.ownerId
      ];

      const self = this;
      db.run(sql, params, async function(this: RunResult, err: Error | null) {
        if (err) {
          console.error('Error updating tournament:', err);
          reject(err);
          return;
        }
        if (this.changes === 0) {
          reject(new Error('Tournament not found or access denied'));
          return;
        }
        try {
          const updatedTournament = await self.getTournamentById(tournament.tournamentId!);
          resolve(updatedTournament);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  public async getTournamentByInvitationCode(invitationCode: number): Promise<TournamentModel> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          TournamentId as tournamentId,
          OwnerId as ownerId,
          Name as name,
          Description as description,
          Deleted as deleted,
          DateCreated as dateCreated,
          DateModified as dateModified,
          DateDeleted as dateDeleted,
          StartDate as startDate,
          EndDate as endDate,
          InvitationCode as invitationCode
        FROM Tournament 
        WHERE InvitationCode = ? AND (Deleted = false OR Deleted IS NULL)`;
      
      db.get(sql, [invitationCode], (err: Error | null, row: any) => {
        if (err) {
          reject(err);
          return;
        }
        if (!row) {
          reject(new Error('Tournament not found'));
          return;
        }
        resolve(row);
      });
    });
  }
} 