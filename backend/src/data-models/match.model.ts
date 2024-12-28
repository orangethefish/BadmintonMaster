import { MatchResult } from '../enums/match.enum';

export interface MatchModel {
  matchId?: string;
  parentMatchId?: string;
  formatId: number;
  groupId?: number;
  team1Id?: number;
  team2Id?: number;
  team1FinalScore?: number;
  team2FinalScore?: number;
  umpireId?: string;
  courtNum?: string;
  winnerId?: number;
  result?: MatchResult;
  extendData?: string;
} 