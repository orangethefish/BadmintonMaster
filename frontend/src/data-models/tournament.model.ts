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