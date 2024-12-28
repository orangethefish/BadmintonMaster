import { BestOf, WinningCondition, PlayOffFormat } from '../enums/tournament.enum';

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
