import { BaseApiService } from '../api/base.service';
import { TournamentModel } from '@/data-models/tournament.model';

export class TournamentService extends BaseApiService {
  private readonly endpoint = '/tournaments';

  async createTournament(tournament: TournamentModel): Promise<TournamentModel> {
    return this.post<TournamentModel>(this.endpoint, tournament);
  }

  async getTournament(id: number): Promise<TournamentModel> {
    return this.get<TournamentModel>(`${this.endpoint}/${id}`);
  }

  async updateTournament(id: number, tournament: Partial<TournamentModel>): Promise<TournamentModel> {
    return this.put<TournamentModel>(`${this.endpoint}/${id}`, tournament);
  }

  async deleteTournament(id: number): Promise<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  async joinTournament(code: string): Promise<TournamentModel> {
    return this.post<TournamentModel>(`${this.endpoint}/join`, { code });
  }
} 