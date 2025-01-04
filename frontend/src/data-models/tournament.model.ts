import { FormatModel } from "./format.model";
import { GroupTeamModel } from "./group.model";
import { MatchModel } from "./match.model";
import { TeamModel } from "./team.model";

export interface TournamentModel {
  tournamentId?: number;
  name: string;
  description: string;
  ownerId?: string | null;
  deleted?: boolean;
  dateCreated?: string;
  dateModified?: string;
  dateDeleted?: string | null;
  startDate: string;
  endDate: string;
  invitationCode?: number;
}

export interface FormatInfoModel{
  format: FormatModel,
  groupsAndTeams: GroupTeamModel[],
}

export interface TournamentInfoModel{
    tournament: TournamentModel,
    formats: FormatInfoModel[]
}

export const defaultTournament: TournamentModel = {
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  ownerId: null
}; 


export interface CreateTournamentRequest {
  tournament: TournamentModel;
  formats: FormatModel[];
}

export interface GroupModel {
  id: string;
  name: string;
}

export interface GroupAndTeamModel {
  group: GroupModel;
  teams: TeamModel[];
}

export interface GroupMatchModel {
  groupAndTeam: GroupAndTeamModel;
  matches: MatchModel[];
}

export interface FormatMatchModel {
  format: FormatModel;
  groupMatches: GroupMatchModel[];
}