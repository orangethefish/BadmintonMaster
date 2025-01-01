import { TeamModel } from "./team.model";

export interface GroupModel {
  groupId?: number;
  formatId: number;
  groupName: string;
  numOfTeams: number;
  deleted?: boolean;
  dateCreated?: string;
  dateModified?: string;
  dateDeleted?: string | null;
}

export interface GroupTeamModel {
  group: GroupModel;
  teams: TeamModel[];
}