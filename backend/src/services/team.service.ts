import { TeamModel } from '../data-models/team.model';
import { db } from '../index';
import { RunResult } from 'sqlite3';

export class TeamService {
  public async addOrUpdateTeam(team: TeamModel): Promise<TeamModel> {
    // Check if team exists if ID is provided
    if (team.teamId) {
      try {
        await this.getTeamById(team.teamId);
        return this.updateTeam(team);
      } catch (error) {
        // If team not found, proceed with creation
        if ((error as Error).message === 'Team not found') {
          return this.createTeam(team);
        }
        throw error;
      }
    }
    return this.createTeam(team);
  }

  private async createTeam(team: TeamModel): Promise<TeamModel> {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO Team (
        GroupId, Player1Name, Player2Name
      ) VALUES (?, ?, ?)`;

      const params = [
        team.groupId,
        team.player1Name,
        team.player2Name
      ];

      const self = this;
      db.run(sql, params, async function(this: RunResult, err: Error | null) {
        if (err) {
          console.error('Error adding team:', err);
          reject(err);
          return;
        }
        try {
          const createdTeam = await self.getTeamById(this.lastID);
          resolve(createdTeam);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  private async updateTeam(team: TeamModel): Promise<TeamModel> {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE Team SET
        GroupId = ?,
        Player1Name = ?,
        Player2Name = ?
        WHERE TeamId = ?`;

      const params = [
        team.groupId,
        team.player1Name,
        team.player2Name,
        team.teamId
      ];

      const self = this;
      db.run(sql, params, async function(this: RunResult, err: Error | null) {
        if (err) {
          console.error('Error updating team:', err);
          reject(err);
          return;
        }
        if (this.changes === 0) {
          reject(new Error('Team not found'));
          return;
        }
        try {
          const updatedTeam = await self.getTeamById(team.teamId!);
          resolve(updatedTeam);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  public async getTeamById(id: number): Promise<TeamModel> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          TeamId as teamId,
          GroupId as groupId,
          Player1Name as player1Name,
          Player2Name as player2Name
        FROM Team 
        WHERE TeamId = ?`;
      
      db.get(sql, [id], (err: Error | null, row: any) => {
        if (err) {
          reject(err);
          return;
        }
        if (!row) {
          reject(new Error('Team not found'));
          return;
        }
        resolve(row);
      });
    });
  }

  public async getTeamsByGroupId(groupId: number): Promise<TeamModel[]> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          TeamId as teamId,
          GroupId as groupId,
          Player1Name as player1Name,
          Player2Name as player2Name
        FROM Team 
        WHERE GroupId = ?`;
      
      db.all(sql, [groupId], (err: Error | null, rows: any[]) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }
} 