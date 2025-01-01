import { FormatModel } from "./format.model";
import { GroupTeamModel } from "./group.model";

export interface MatchModel {
  matchId?: number;
  team1Score?: number;
  team2Score?: number;
  team1Id: number;
  team2Id: number;
  status: MatchStatus;
  startTime?: string;
  endTime?: string;
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