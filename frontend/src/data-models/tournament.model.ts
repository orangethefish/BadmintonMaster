import { FormatModel } from "./format.model";
import { GroupTeamModel } from "./group.model";

export interface TournamentModel {
  tournamentId?: number;
  name: string;
  description: string;
  deleted?: boolean;
  dateCreated?: string;
  dateModified?: string;
  dateDeleted?: string | null;
  startDate: string;
  endDate: string;
  invitationCode?: number;
}

export interface TournamentInfoModel {
  tournament: TournamentModel;
  formats: FormatModel[];
  groupTeams: GroupTeamModel[];
}

export const defaultTournament: TournamentModel = {
  name: '',
  description: '',
  startDate: '',
  endDate: ''
}; 


export interface CreateTournamentRequest {
  tournament: TournamentModel;
  formats: FormatModel[];
}