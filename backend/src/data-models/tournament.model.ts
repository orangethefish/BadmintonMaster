import { BestOf, WinningCondition, PlayOffFormat } from '../enums/tournament.enum';

export interface TournamentModel {
  tournamentId?: number;
  name: string;
  description: string;
  numOfGroups: number;
  groupScore: number;
  groupMaxScore: number;
  groupBestOf: BestOf;
  groupWinning: WinningCondition;
  groupOffBestOf: BestOf;
  playOffScore: number;
  playOffMaxScore: number;
  playOffBestOf: BestOf;
  playOffWinning: WinningCondition;
  playOffFormat: PlayOffFormat;
  deleted?: boolean;
  dateCreated?: Date;
  dateModified?: Date;
  dateDeleted?: Date | null;
  startDate: string;
  endDate: string;
  invitationCode?: number;
}
