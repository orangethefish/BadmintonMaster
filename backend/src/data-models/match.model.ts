import { MatchStatus } from '../enums/match.enum';
import { FormatModel } from './format.model';
import { GroupTeamModel } from './group.model';

export interface MatchModel {
  matchId?: string;
  parentMatchId?: string;
  formatId: number;
  format?: FormatModel;
  groupId?: number;
  team1Id?: number;
  team2Id?: number;
  team1FinalScore?: number;
  team2FinalScore?: number;
  umpireId?: string;
  courtNum?: string;
  winnerId?: number;
  result?: MatchStatus;
  extendData?: string;
  deleted?: boolean;
  dateCreated?: string;
  dateModified?: string;
  dateDeleted?: string | null;
}

export interface GroupMatchModel {
  groupAndTeam: GroupTeamModel;
  matches: MatchModel[];
}

export interface FormatMatchModel {
  format: FormatModel;
  groupMatches: GroupMatchModel[];
}