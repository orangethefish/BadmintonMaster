import { BaseApiService } from '../api/base.service';
import { TournamentModel, CreateTournamentRequest } from '@/data-models/tournament.model';
import { GroupModel, GroupTeamModel } from '@/data-models/group.model';
import { TeamModel } from '@/data-models/team.model';



export class TournamentService extends BaseApiService {
  private readonly endpoint = '/tournaments';

  async saveTournament(request: CreateTournamentRequest): Promise<CreateTournamentRequest> {
    return this.post<CreateTournamentRequest>(this.endpoint, request);
  }

  async saveGroup(tournamentId: number, request: GroupTeamModel[]): Promise<GroupTeamModel[]> {
    return this.post<GroupTeamModel[]>(`${this.endpoint}/${tournamentId}/groups`, request);
  }

  async getTournament(id: number): Promise<TournamentModel> {
    return this.get<TournamentModel>(`${this.endpoint}/${id}`);
  }

  async deleteTournament(id: number): Promise<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  async joinTournament(code: string): Promise<TournamentModel> {
    return this.post<TournamentModel>(`${this.endpoint}/join`, { code });
  }
} 