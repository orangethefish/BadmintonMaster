import { TeamModel } from "./team.model";

export interface GroupModel {
    groupId?: number;
    formatId: number;
    groupName: string;
    numOfTeams: number;
}

export interface CreateGroupRequest {
  groups: GroupModel[];
  teams: TeamModel[];
}
