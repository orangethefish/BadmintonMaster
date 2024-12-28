import { GroupModel } from '../data-models/group.model';
import { TeamModel } from '../data-models/team.model';
import { db } from '../index';
import { RunResult } from 'sqlite3';
import { TeamService } from './team.service';

export interface GroupWithTeams extends GroupModel {
  teams?: TeamModel[];
}

export class GroupService {
  private teamService: TeamService;

  constructor() {
    this.teamService = new TeamService();
  }

  public async addGroup(group: GroupModel): Promise<GroupModel> {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO "Group" (
        FormatId, GroupName, NumOfTeams
      ) VALUES (?, ?, ?)`;

      const params = [
        group.formatId,
        group.groupName,
        group.numOfTeams
      ];

      const self = this;
      db.run(sql, params, async function(this: RunResult, err: Error | null) {
        if (err) {
          console.error('Error adding group:', err);
          reject(err);
          return;
        }
        try {
          const createdGroup = await self.getGroupById(this.lastID);
          resolve(createdGroup);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  public async getGroupById(id: number): Promise<GroupModel> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          GroupId as groupId,
          FormatId as formatId,
          GroupName as groupName,
          NumOfTeams as numOfTeams
        FROM "Group" 
        WHERE GroupId = ?`;
      
      db.get(sql, [id], (err: Error | null, row: any) => {
        if (err) {
          reject(err);
          return;
        }
        if (!row) {
          reject(new Error('Group not found'));
          return;
        }
        resolve(row);
      });
    });
  }

  public async getGroupWithTeams(id: number): Promise<GroupWithTeams> {
    const group = await this.getGroupById(id);
    const teams = await this.teamService.getTeamsByGroupId(id);
    return { ...group, teams };
  }

  public async getGroupsByFormatId(formatId: number): Promise<GroupModel[]> {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          GroupId as groupId,
          FormatId as formatId,
          GroupName as groupName,
          NumOfTeams as numOfTeams
        FROM "Group" 
        WHERE FormatId = ?`;
      
      db.all(sql, [formatId], (err: Error | null, rows: any[]) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }
} 