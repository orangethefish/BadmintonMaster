import { FormatModel } from "./format.model";
import { GroupTeamModel } from "./group.model";

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

export interface FormatModel {
  id: string;
  type: string;
  name: string;
}

export interface GroupModel {
  id: string;
  name: string;
}

export interface TeamModel {
  id: string;
  name: string;
  players: string[];
}

export interface MatchModel {
  id: string;
  team1Id: string;
  team2Id: string;
  score1?: number;
  score2?: number;
  status: 'pending' | 'inProgress' | 'completed' | 'cancelled';
  startTime?: string;
  endTime?: string;
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