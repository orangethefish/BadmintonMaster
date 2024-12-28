import { BestOf, WinningCondition, PlayOffFormat, FormatType } from '../enums/tournament.enum';

export interface FormatModel {
  formatId?: number;
  tournamentId: number;
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