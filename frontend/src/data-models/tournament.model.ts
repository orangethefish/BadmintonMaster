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

export const defaultTournament: TournamentModel = {
  name: '',
  description: '',
  numOfGroups: 4,
  groupScore: 21,
  groupMaxScore: 21,
  groupBestOf: BestOf.ONE,
  groupWinning: WinningCondition.EXACT,
  groupOffBestOf: BestOf.ONE,
  playOffScore: 25,
  playOffMaxScore: 25,
  playOffBestOf: BestOf.ONE,
  playOffWinning: WinningCondition.EXACT,
  playOffFormat: PlayOffFormat.SINGLE_ELIMINATION,
  startDate: '',
  endDate: ''
}; 