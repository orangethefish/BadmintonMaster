import { BestOf, WinningCondition, PlayOffFormat, FormatType } from '../enums/tournament.enum';

export interface FormatModel {
  formatId?: number;
  tournamentId?: number;
  numOfGroups: number;
  groupScore: number;
  groupMaxScore: number;
  groupBestOf: BestOf;
  groupWinningCondition: WinningCondition;
  groupOffBestOf: BestOf;
  playOffScore: number;
  playOffMaxScore: number;
  playOffBestOf: BestOf;
  playOffWinningCondition: WinningCondition;
  playOffFormat: PlayOffFormat;
  deleted?: boolean;
  dateCreated?: string;
  dateModified?: string;
  dateDeleted?: string | null;
  formatType: FormatType;
}

export const defaultFormat: FormatModel = {
  numOfGroups: 4,
  groupScore: 21,
  groupMaxScore: 21,
  groupBestOf: BestOf.ONE,
  groupWinningCondition: WinningCondition.EXACT,
  groupOffBestOf: BestOf.ONE,
  playOffScore: 25,
  playOffMaxScore: 25,
  playOffBestOf: BestOf.ONE,
  playOffWinningCondition: WinningCondition.EXACT,
  playOffFormat: PlayOffFormat.SINGLE_ELIMINATION,
  formatType: FormatType.MEN_DOUBLES
}; 