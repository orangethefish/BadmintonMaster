import { BaseApiService } from '../api/base.service';
import { TournamentModel } from '@/data-models/tournament.model';
import { TournamentRequest } from '@/types/tournament.types';

export class TournamentService extends BaseApiService {
  private readonly endpoint = '/tournaments';

  async saveTournament(request: TournamentRequest): Promise<TournamentModel> {
    return this.post<TournamentModel>(this.endpoint, request);
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