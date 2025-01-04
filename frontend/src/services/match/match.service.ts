import { BaseApiService } from "../api/base.service";
import { FormatModel } from "@/data-models/format.model";
import { TeamModel } from "@/data-models/team.model";
import { MatchModel } from "@/data-models/match.model";
import { MatchStatus } from "@/data-models/match.model";
import { FormatMatchModel } from "@/data-models/match.model";

interface MatchDetails {
  match: MatchModel;
  team1: TeamModel;
  team2: TeamModel;
}

interface UpdateMatchScoreRequest {
  team1Score: number;
  team2Score: number;
  result: MatchStatus;
}

export class MatchService extends BaseApiService {
  private readonly endpoint = '/matches';

  async assignUmpireToMatch(matchId: string, umpireId: string): Promise<boolean> {
    return this.post<boolean>(`${this.endpoint}/${matchId}`, { umpireId });
  }

  async getMatchDetails(matchId: string): Promise<MatchDetails> {
    return this.get<MatchDetails>(`${this.endpoint}/${matchId}/details`);
  }

  async updateMatchScore(matchId: string, request: UpdateMatchScoreRequest): Promise<void> {
    return this.put<void>(`${this.endpoint}//${matchId}/score`, request);
  }

  async getMatchFormat(matchId: string): Promise<MatchModel> {
    return this.get<MatchModel>(`${this.endpoint}/${matchId}/format`);
  }
}