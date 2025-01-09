import { FormatModel } from "./format.model";
import { GroupTeamModel } from "./group.model";

export interface MatchModel {
  matchId?: string;
  formatId: number;
  format?: FormatModel;
  team1Id: number;
  team2Id: number;
  result: MatchStatus;
  startTime?: string;
  endTime?: string;
  umpireId?: string;
  game?: GameModel[];
}

export interface GameModel{
  gameId?: number;
  matchId?: string;
  team1Score?: number;
  team2Score?: number;
}

export interface GroupMatchModel {
  groupAndTeam: GroupTeamModel;
  matches: MatchModel[];
}

export interface FormatMatchModel {
  format: FormatModel;
  groupMatches: GroupMatchModel[];
}

export enum MatchStatus {
    PENDING = 0,
    IN_PROGRESS = 1,
    CANCELLED = 2,
    TEAM1_WINS = 3,
    TEAM2_WINS = 4,
    TEAM1_RETIRES = 5,
    TEAM2_RETIRES = 6,
    TEAM1_ABSENT = 7,
    TEAM2_ABSENT = 8
  } 