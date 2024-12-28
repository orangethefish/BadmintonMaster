import { BestOf, WinningCondition, PlayOffFormat } from '../enums/tournament.enum';

export interface TournamentModel {
  tournamentId?: number;
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

export const defaultTournament: TournamentModel = {
  description: '',
  numOfGroups: 1,
  groupScore: 0,
  groupMaxScore: 0,
  groupBestOf: BestOf.ONE,
  groupWinning: WinningCondition.POINTS,
  groupOffBestOf: BestOf.ONE,
  playOffScore: 0,
  playOffMaxScore: 0,
  playOffBestOf: BestOf.ONE,
  playOffWinning: WinningCondition.POINTS,
  playOffFormat: PlayOffFormat.SINGLE_ELIMINATION,
  startDate: '',
  endDate: ''
}; 