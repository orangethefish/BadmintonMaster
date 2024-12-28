import { FormatModel } from "./format.model";

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