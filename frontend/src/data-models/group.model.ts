import { TeamModel } from "./team.model";

export interface GroupModel {
    groupId?: number;
    formatId: number;
    groupName: string;
    numOfTeams: number;
}

export interface GroupTeamModel{
  group: GroupModel,
  teams: TeamModel[]
}

